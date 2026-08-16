package webhound_github_transport

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	webhound_fetching "go.mod/services/fetching"
)

// @Summary      Get GitHub user by username
// @Description  Retrieve a GitHub user profile including followers and followees. Reads from the database first, falls back to the external fetching service when the user is not cached.
// @Tags         github
// @Accept       json
// @Produce      json
// @Param        username path string true "GitHub username"
// @Success      200 {object} webhound_github_transport.User "GitHub user found"
// @Failure      400 {object} string "User not found or database error"
// @Router       /api/github/users/{username} [get]
func AddGetUserHandler(r *chi.Mux, db *pgxpool.Pool, fetching *webhound_fetching.Client, ctx context.Context) {
	r.Get("/api/github/users/{username}", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Add("Content-Type", "application/json")
		encoder := json.NewEncoder(w)

		username := chi.URLParam(r, "username")

		limit := 50
		if raw := r.URL.Query().Get("limit"); raw != "" {
			if parsed, err := strconv.Atoi(raw); err == nil {
				limit = parsed
			}
		}
		if limit < 1 {
			limit = 1
		}
		if limit > 100 {
			limit = 100
		}

		user_dto, err := GetUserDtoOrFetch(db, ctx, fetching, username, limit)
		if err != nil {
			err = fmt.Errorf("failed to fetch user @%s for GET /github/users/{username}: %w", username, err)
			w.WriteHeader(http.StatusBadRequest)
			encoder.Encode(err.Error())
			return
		}

		w.WriteHeader(http.StatusOK)
		encoder.Encode(user_dto)
	})
}

// @Summary      Create a GitHub user
// @Description  Register a new GitHub user with profile data and follow relationships
// @Tags         github
// @Accept       json
// @Produce      json
// @Param        user body webhound_github_transport.User true "GitHub user data"
// @Success      200 {object} webhound_github_transport.User "GitHub user created successfully"
// @Failure      400 {object} string "Invalid input or database error"
// @Router       /api/github/users [post]
func AddPostUserHandler(r *chi.Mux, db *pgxpool.Pool, ctx context.Context) {
	r.Post("/api/github/users", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Add("Content-Type", "application/json")
		encoder := json.NewEncoder(w)
		decoder := json.NewDecoder(r.Body)

		var user_dto User
		err := decoder.Decode(&user_dto)
		if err != nil {
			err = fmt.Errorf("failed to decode data from body for POST /github/users: %w", err)
			w.WriteHeader(http.StatusBadRequest)
			encoder.Encode(err.Error())
			return
		}

		_, err = PostUserDto(db, ctx, &user_dto)
		if err != nil {
			err = fmt.Errorf("failed to post user %s for POST /github/users: %w", user_dto.Username, err)
			w.WriteHeader(http.StatusBadRequest)
			encoder.Encode(err.Error())
			return
		}

		w.WriteHeader(http.StatusOK)
		encoder.Encode(user_dto)
	})
}

// @Summary      List all GitHub users
// @Description  Retrieve all GitHub users with their followers and followees
// @Tags         github
// @Accept       json
// @Produce      json
// @Success      200 {array} webhound_github_transport.User "GitHub users found"
// @Failure      400 {object} string "Database error"
// @Router       /api/github/users [get]
func AddGetUsersHandler(r *chi.Mux, db *pgxpool.Pool, ctx context.Context) {
	r.Get("/api/github/users", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Add("Content-Type", "application/json")
		encoder := json.NewEncoder(w)

		users_dtos, err := GetUsersDto(db, ctx)
		if err != nil {
			err = fmt.Errorf("failed to fetch github users: %w", err)
			w.WriteHeader(http.StatusBadRequest)
			encoder.Encode(err.Error())
			return
		}

		w.WriteHeader(http.StatusOK)
		encoder.Encode(users_dtos)
	})
}
