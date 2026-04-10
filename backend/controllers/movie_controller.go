package controllers

import (
	"context"
	"errors"
	"net/http"
	"regexp"
	"strconv"
	"strings"
	"time"

	"movie-management-backend/config"
	"movie-management-backend/models"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

const moviesCollectionName = "movies"

// moviesCollection returns the movies collection or writes 500 and nil if unavailable.
func moviesCollection(c *gin.Context) *mongo.Collection {
	col := config.GetCollection(moviesCollectionName)
	if col == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "database is not initialized"})
		return nil
	}
	return col
}

func parseMovieIDParam(c *gin.Context) (bson.ObjectID, bool) {
	idParam := c.Param("id")
	movieID, err := bson.ObjectIDFromHex(idParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid movie id"})
		return movieID, false
	}
	return movieID, true
}

// ListMovies supports optional query params:
//   - title: case-insensitive partial match on title ($regex)
//   - genre: case-insensitive exact match on genre (anchored $regex)
//   - year: exact match on year field
//   - page: 1-based page index (default 1)
//   - limit: page size (default 10, max 100)
func ListMovies(c *gin.Context) {
	col := moviesCollection(c)
	if col == nil {
		return
	}

	title := strings.TrimSpace(c.Query("title"))
	genre := strings.TrimSpace(c.Query("genre"))
	yearStr := strings.TrimSpace(c.Query("year"))

	page, err := strconv.Atoi(c.DefaultQuery("page", "1"))
	if err != nil || page < 1 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid page parameter; use a positive integer"})
		return
	}
	limit, err := strconv.Atoi(c.DefaultQuery("limit", "10"))
	if err != nil || limit < 1 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid limit parameter; use a positive integer"})
		return
	}
	if limit > 100 {
		limit = 100
	}

	filter := bson.M{}
	if title != "" {
		// Partial match; QuoteMeta prevents regex injection from user input.
		filter["title"] = bson.M{
			"$regex":   regexp.QuoteMeta(title),
			"$options": "i",
		}
	}
	if genre != "" {
		filter["genre"] = bson.M{
			"$regex":   "^" + regexp.QuoteMeta(genre) + "$",
			"$options": "i",
		}
	}
	if yearStr != "" {
		year, err := strconv.Atoi(yearStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid year parameter; use an integer"})
			return
		}
		filter["year"] = year
	}

	ctx, cancel := context.WithTimeout(c.Request.Context(), 10*time.Second)
	defer cancel()

	total, err := col.CountDocuments(ctx, filter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to count movies"})
		return
	}

	skip := int64((page - 1) * limit)
	findOpts := options.Find().
		SetSkip(skip).
		SetLimit(int64(limit)).
		SetSort(bson.D{{Key: "_id", Value: 1}})

	cursor, err := col.Find(ctx, filter, findOpts)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to list movies"})
		return
	}
	defer cursor.Close(ctx)

	var movies []models.Movie
	if err := cursor.All(ctx, &movies); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to decode movies"})
		return
	}
	if movies == nil {
		movies = []models.Movie{}
	}

	c.JSON(http.StatusOK, gin.H{
		"movies": movies,
		"total":  total,
		"page":   page,
		"limit":  limit,
	})
}

func DeleteMovie(c *gin.Context) {
	movieID, ok := parseMovieIDParam(c)
	if !ok {
		return
	}

	col := moviesCollection(c)
	if col == nil {
		return
	}

	ctx, cancel := context.WithTimeout(c.Request.Context(), 10*time.Second)
	defer cancel()

	result, err := col.DeleteOne(ctx, bson.M{"_id": movieID})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to delete movie"})
		return
	}
	if result.DeletedCount == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "movie not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "movie deleted successfully",
		"id":      movieID.Hex(),
	})
}

func CreateMovie(c *gin.Context) {
	var movie models.Movie
	if err := c.ShouldBindJSON(&movie); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body"})
		return
	}

	ctx, cancel := context.WithTimeout(c.Request.Context(), 10*time.Second)
	defer cancel()

	if err := movie.ValidateWithDB(ctx, nil); err != nil {
		handleValidationError(c, err)
		return
	}

	collection := moviesCollection(c)
	if collection == nil {
		return
	}

	result, err := collection.InsertOne(ctx, movie)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create movie"})
		return
	}

	insertedID, ok := result.InsertedID.(bson.ObjectID)
	if ok {
		movie.ID = insertedID
	}

	c.JSON(http.StatusCreated, movie)
}

func UpdateMovie(c *gin.Context) {
	movieID, ok := parseMovieIDParam(c)
	if !ok {
		return
	}

	var movie models.Movie
	if err := c.ShouldBindJSON(&movie); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body"})
		return
	}

	ctx, cancel := context.WithTimeout(c.Request.Context(), 10*time.Second)
	defer cancel()

	if err := movie.ValidateWithDB(ctx, &movieID); err != nil {
		handleValidationError(c, err)
		return
	}

	collection := moviesCollection(c)
	if collection == nil {
		return
	}

	update := bson.M{
		"$set": bson.M{
			"title":  movie.Title,
			"genre":  movie.Genre,
			"year":   movie.Year,
			"rating": movie.Rating,
		},
	}

	opts := options.FindOneAndUpdate().SetReturnDocument(options.After)
	var updatedMovie models.Movie
	err := collection.FindOneAndUpdate(ctx, bson.M{"_id": movieID}, update, opts).Decode(&updatedMovie)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			c.JSON(http.StatusNotFound, gin.H{"error": "movie not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to update movie"})
		return
	}

	c.JSON(http.StatusOK, updatedMovie)
}

func handleValidationError(c *gin.Context, err error) {
	switch {
	case errors.Is(err, models.ErrDuplicateTitle):
		c.JSON(http.StatusConflict, gin.H{"error": err.Error()})
	case errors.Is(err, models.ErrTitleRequired),
		errors.Is(err, models.ErrGenreRequired),
		errors.Is(err, models.ErrYearOutOfRange),
		errors.Is(err, models.ErrRatingOutOfRange):
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	default:
		c.JSON(http.StatusInternalServerError, gin.H{"error": "validation failed"})
	}
}
