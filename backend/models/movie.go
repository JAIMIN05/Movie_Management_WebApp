package models

import (
	"context"
	"errors"
	"fmt"
	"regexp"
	"strings"
	"time"

	"movie-management-backend/config"

	"go.mongodb.org/mongo-driver/v2/bson"
)

const moviesCollectionName = "movies"

var (
	ErrTitleRequired   = errors.New("title is required")
	ErrGenreRequired   = errors.New("genre is required")
	ErrYearOutOfRange  = errors.New("year must be between 1900 and current year")
	ErrRatingOutOfRange = errors.New("rating must be between 0 and 5")
	ErrDuplicateTitle  = errors.New("movie title already exists")
)

type Movie struct {
	ID     bson.ObjectID `json:"id,omitempty" bson:"_id,omitempty"`
	Title  string        `json:"title" bson:"title"`
	Genre  string        `json:"genre" bson:"genre"`
	Year   int           `json:"year" bson:"year"`
	Rating float64       `json:"rating" bson:"rating"`
}

func (m *Movie) ValidateBasic() error {
	m.Title = strings.TrimSpace(m.Title)
	m.Genre = strings.TrimSpace(m.Genre)

	if m.Title == "" {
		return ErrTitleRequired
	}
	if m.Genre == "" {
		return ErrGenreRequired
	}

	currentYear := time.Now().Year()
	if m.Year < 1900 || m.Year > currentYear {
		return ErrYearOutOfRange
	}
	if m.Rating < 0 || m.Rating > 5 {
		return ErrRatingOutOfRange
	}

	return nil
}

// ValidateWithDB runs field validation and duplicate-title validation.
func (m *Movie) ValidateWithDB(ctx context.Context, excludeID *bson.ObjectID) error {
	if err := m.ValidateBasic(); err != nil {
		return err
	}

	duplicate, err := IsDuplicateTitle(ctx, m.Title, excludeID)
	if err != nil {
		return err
	}
	if duplicate {
		return ErrDuplicateTitle
	}
	return nil
}

func IsDuplicateTitle(ctx context.Context, title string, excludeID *bson.ObjectID) (bool, error) {
	collection := config.GetCollection(moviesCollectionName)
	if collection == nil {
		return false, errors.New("movies collection is not initialized")
	}

	trimmedTitle := strings.TrimSpace(title)
	filter := bson.M{
		"title": bson.M{
			"$regex":   "^" + regexp.QuoteMeta(trimmedTitle) + "$",
			"$options": "i",
		},
	}

	if excludeID != nil {
		filter["_id"] = bson.M{"$ne": *excludeID}
	}

	count, err := collection.CountDocuments(ctx, filter)
	if err != nil {
		return false, fmt.Errorf("failed to check duplicate title: %w", err)
	}

	return count > 0, nil
}
