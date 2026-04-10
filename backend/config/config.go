package config

import "os"

// AppConfig holds application-level configuration.
type AppConfig struct {
	Port     string
	MongoURI string
	DBName   string
}

func LoadConfig() AppConfig {
	return AppConfig{
		Port:     getEnv("PORT", "8080"),
		MongoURI: getEnv("MONGO_URI", "mongodb://localhost:27017"),
		DBName:   getEnv("MONGO_DB_NAME", "movie_management"),
	}
}

func getEnv(key, fallback string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return fallback
}
