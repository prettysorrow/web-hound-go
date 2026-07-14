// @title           WebHound API
// @version         0.1.0
// @description     Backend API for WebHound service
// @BasePath        /
package main

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"os"
	"sync"

	"github.com/go-chi/chi/v5"
	"github.com/rs/zerolog"
	httpSwagger "github.com/swaggo/http-swagger"

	database "go.mod/database"
	_ "go.mod/docs"
	github_transport "go.mod/entities/github/transport"
	requests_transport "go.mod/entities/requests/transport"
	users_transport "go.mod/entities/users/transport"
	services "go.mod/services"
)

var (
	logger zerolog.Logger = services.Logger
)

func failwith(err error) {
	logger.Fatal().Err(err).Msg("failed to start backend server")
	os.Exit(1)
}

func GetBackendServerAddressFromEnv() (*string, error) {
	backend_server_host := "BACKEND_SERVER_HOST"
	backend_server_port := "BACKEND_SERVER_PORT"

	host := os.Getenv(backend_server_host)
	port := os.Getenv(backend_server_port)

	if host == "" {
		err := errors.New("failed to get server host from env")
		logger.Fatal().Err(err).Str("env_var_name", backend_server_host).Msg("")
		return nil, err
	}
	if port == "" {
		err := errors.New("failed to get server port from env")
		logger.Fatal().Err(err).Str("env_var_name", backend_server_port).Msg("")
		return nil, err
	}

	addr := fmt.Sprintf("%s:%s", host, port)
	return &addr, nil
}

func main() {
	server_addr, err := GetBackendServerAddressFromEnv()
	if err != nil {
		failwith(err)
	}

	connection_uri, err := database.GetConnectionStringFromEnv()
	if err != nil {
		failwith(err)
	}

	db, err := database.Connect(*connection_uri)
	if err != nil {
		failwith(err)
	}

	r := chi.NewRouter()

	r.Use(services.LoggerMiddleware(logger))

	ctx := context.Background()

	users_transport.AddGetUserHandler(r, db, ctx)
	users_transport.AddPostUserHandler(r, db, ctx)
	users_transport.AddGetUsersHandler(r, db, ctx)

	github_transport.AddGetUserHandler(r, db, ctx)
	github_transport.AddPostUserHandler(r, db, ctx)

	requests_transport.AddGetRequestHandler(r, db, ctx)
	requests_transport.AddGetUserRequestsHandler(r, db, ctx)
	requests_transport.AddPostRequestHandler(r, db, ctx)

	r.Get("/swagger/*", httpSwagger.Handler())

	var wg sync.WaitGroup

	wg.Go(func() {
		err := http.ListenAndServe(*server_addr, r)
		if err != nil {
			if errors.Is(err, http.ErrServerClosed) {
				logger.Info().Msg("backend server closed gracefully")
			} else {
				logger.Fatal().Err(err).Msg("backend server closed with an error")
			}
		}
	})

	logger.Info().Str("server address", *server_addr).Msg("backend server started")

	wg.Wait()
}
