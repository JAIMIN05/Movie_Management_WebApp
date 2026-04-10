package routes

import (
	"movie-management-backend/controllers"

	"github.com/gin-gonic/gin"
)

func RegisterRoutes(router *gin.Engine) {
	router.GET("/", controllers.HealthCheck)
	router.GET("/movies", controllers.ListMovies)
	router.POST("/movies", controllers.CreateMovie)
	router.PUT("/movies/:id", controllers.UpdateMovie)
	router.DELETE("/movies/:id", controllers.DeleteMovie)
}
