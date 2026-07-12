package webhound_database

import (
	"context"
	"fmt"
	"os"

	"github.com/jackc/pgx/v5"
)

func Connect(connection_uri string) (*pgx.Conn, error) {
	conn, err := pgx.Connect(context.Background(), connection_uri)
	if err != nil {
		err = fmt.Errorf("failed to connect to database: %w", err)
		return nil, err
	}

	return conn, nil
}

func GetConnectionStringFromEnv() (*string, error) {
	cs := os.Getenv("POSTGRES_HOST_CONNECTION")
	if cs == "" {
		err := fmt.Errorf("postgresql connection string is not set or empty")
		return nil, err
	}

	return &cs, nil
}
