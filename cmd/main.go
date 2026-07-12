package main

import (
	"errors"
	"fmt"
	"net/http"
	"os"
	"sync"

	"github.com/rs/zerolog"
	database "go.mod/database"
	services "go.mod/services"
	webhound_services "go.mod/services"
	transport "go.mod/transport"
)

var (
	logger zerolog.Logger = webhound_services.Logger
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

	mux := http.NewServeMux()

	transport.AddGetUserHandler(mux, db)
	transport.AddPostUserHandler(mux, db)
	transport.AddGetUsersHandler(mux, db)

	handler := services.LoggerMiddleware(logger)(mux)

	var wg sync.WaitGroup

	wg.Go(func() {
		err := http.ListenAndServe(*server_addr, handler)
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
