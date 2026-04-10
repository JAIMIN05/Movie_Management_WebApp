package main

import (
	"log"
	"movie-management-backend/config"
	"movie-management-backend/routes"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	cfg := config.LoadConfig()

	if err := config.ConnectDB(cfg); err != nil {
		log.Fatalf("database connection failed: %v", err)
	}
	defer func() {
		if err := config.DisconnectDB(); err != nil {
			log.Printf("database disconnect failed: %v", err)
		}
	}()

	router := gin.Default()

	router.Use(cors.New(cors.Config{
		AllowOrigins: []string{
			"http://localhost:5173",
			"http://127.0.0.1:5173",
		},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept"},
		AllowCredentials: true,
	}))

	routes.RegisterRoutes(router)

	if err := router.Run(":" + cfg.Port); err != nil {
		log.Fatalf("server failed to start: %v", err)
	}
}
