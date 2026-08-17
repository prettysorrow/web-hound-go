package webhound_database

import (
	"context"
	"fmt"
	"net/url"

	"github.com/jackc/pgx/v5/pgxpool"
	webhound_config "go.mod/services/config"
)

func Connect(connection_uri string) (*pgxpool.Pool, error) {
	pool, err := pgxpool.New(context.Background(), connection_uri)
	if err != nil {
		err = fmt.Errorf("failed to connect to database: %w", err)
		return nil, err
	}

	if err := pool.Ping(context.Background()); err != nil {
		err = fmt.Errorf("failed to ping database: %w", err)
		return nil, err
	}

	return pool, nil
}

func GetConnectionStringFromEnv() (*string, error) {
	user := webhound_config.GetString("POSTGRES_USER")
	password := webhound_config.GetString("POSTGRES_PASSWORD")
	database_name := webhound_config.GetString("POSTGRES_DB")
	host := webhound_config.GetString("POSTGRES_HOST")
	if host == "" {
		host = "localhost"
	}
	port := webhound_config.GetString("POSTGRES_HOST_PORT")

	if user == "" || password == "" || database_name == "" || port == "" {
		err := fmt.Errorf("postgresql settings are not set or empty (POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB, POSTGRES_HOST_PORT)")
		return nil, err
	}

	cs := fmt.Sprintf(
		"postgres://%s:%s@%s:%s/%s?sslmode=disable",
		url.QueryEscape(user),
		url.QueryEscape(password),
		host,
		port,
		url.QueryEscape(database_name),
	)
	return &cs, nil
}
