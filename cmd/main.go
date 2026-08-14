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
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/rs/zerolog"
	httpSwagger "github.com/swaggo/http-swagger"

	database "go.mod/database"
	_ "go.mod/docs"
	services "go.mod/services"
	webhound_config "go.mod/services/config"

	github_transport "go.mod/entities/github/transport"
	instagram_transport "go.mod/entities/instagram/transport"
	requests_transport "go.mod/entities/requests/transport"
	telegram_transport "go.mod/entities/telegram/transport"
	users_transport "go.mod/entities/users/transport"
	webhound_fetching "go.mod/services/fetching"
)

var (
	logger zerolog.Logger = services.Logger
)

func failwith(err error) {
	logger.Fatal().Err(err).Msg("failed to start backend server")
	os.Exit(1)
}

// @Summary      Health check
// @Description  Check whether the backend server is up and running
// @Tags         utils
// @Produce      json
// @Success      200 {object} string "Backend server is healthy"
// @Router       /api/health [get]
func HealthHandler(w http.ResponseWriter, _ *http.Request) {
	w.Header().Add("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("{}"))
}

func GetBackendServerAddressFromEnv() (*string, error) {
	host := webhound_config.GetString("BACKEND_SERVER_HOST")
	port := webhound_config.GetString("BACKEND_SERVER_PORT")

	if host == "" || port == "" {
		return nil, errors.New("BACKEND_SERVER_HOST or BACKEND_SERVER_PORT is not set or empty")
	}

	addr := fmt.Sprintf("%s:%s", host, port)
	return &addr, nil
}

func GetFetchingServerAddressFromEnv() string {
	host := webhound_config.GetString("FETCHING_SERVER_HOST")
	if host == "" {
		host = "127.0.0.1"
	}
	port := webhound_config.GetString("FETCHING_SERVER_PORT")
	if port == "" {
		port = "8090"
	}

	return fmt.Sprintf("http://%s:%s", host, port)
}

func main() {
	if err := webhound_config.Init(); err != nil {
		failwith(err)
	}

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
	defer db.Close()

	r := chi.NewRouter()

	r.Use(services.CorsMiddleware)
	r.Use(services.LoggerMiddleware(logger))
	r.Use(middleware.Recoverer)
	r.Use(middleware.Timeout(30 * time.Second))

	r.Get("/api/health", HealthHandler)

	ctx := context.Background()

	fetching := webhound_fetching.NewClient(GetFetchingServerAddressFromEnv())

	users_transport.AddGetUserHandler(r, db, ctx)
	users_transport.AddPostUserHandler(r, db, ctx)
	users_transport.AddGetUsersHandler(r, db, ctx)

	requests_transport.AddGetRequestsHandler(r, db, ctx)
	requests_transport.AddGetUserRequestsHandler(r, db, ctx)
	requests_transport.AddPostRequestHandler(r, db, ctx)

	github_transport.AddPostUserHandler(r, db, ctx)
	github_transport.AddGetUsersHandler(r, db, ctx)
	github_transport.AddGetUsersHandler(r, db, ctx)

	telegram_transport.AddGetUserHandler(r, db, ctx)
	telegram_transport.AddPostUserHandler(r, db, ctx)

	instagram_transport.AddPostInstagramUser(r, db, ctx)

	github_transport.AddGetUserHandler(r, db, fetching, ctx)
	instagram_transport.AddGetInstagramUserHandler(r, db, fetching, ctx)

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
