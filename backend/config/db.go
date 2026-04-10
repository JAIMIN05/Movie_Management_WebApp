package config

import (
	"context"
	"fmt"
	"time"

	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
	"go.mongodb.org/mongo-driver/v2/mongo/readpref"
)

var (
	// MongoClient is the shared MongoDB client for the whole application.
	MongoClient *mongo.Client
	// MongoDatabase is the shared DB handle used by repositories/controllers.
	MongoDatabase *mongo.Database
)

func ConnectDB(cfg AppConfig) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(options.Client().ApplyURI(cfg.MongoURI))
	if err != nil {
		return fmt.Errorf("failed to create mongo client: %w", err)
	}

	if err := client.Ping(ctx, readpref.Primary()); err != nil {
		return fmt.Errorf("failed to ping mongo: %w", err)
	}

	MongoClient = client
	MongoDatabase = client.Database(cfg.DBName)
	return nil
}

func DisconnectDB() error {
	if MongoClient == nil {
		return nil
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	return MongoClient.Disconnect(ctx)
}

func GetCollection(name string) *mongo.Collection {
	if MongoDatabase == nil {
		return nil
	}
	return MongoDatabase.Collection(name)
}
