package webhound_github_transport

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/go-chi/chi/v5"
	webhound_fetching "go.mod/services/fetching"
)

// @Summary      Get GitHub user by username
// @Description  Retrieve a GitHub user profile including followers and followees. Fetches from the external fetching service on demand and serves the result from an in-memory cache afterwards.
// @Tags         github
// @Accept       json
// @Produce      json
// @Param        username path string true "GitHub username"
// @Success      200 {object} webhound_github_transport.User "GitHub user found"
// @Failure      400 {object} string "User not found or fetching error"
// @Router       /api/github/users/{username} [get]
func AddGetUserHandler(r *chi.Mux, fetching *webhound_fetching.Client, ctx context.Context) {
	r.Get("/api/github/users/{username}", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Add("Content-Type", "application/json")
		encoder := json.NewEncoder(w)

		username := chi.URLParam(r, "username")

		user_dto, err := GetUserDtoOrFetch(ctx, fetching, username)
		if err != nil {
			err = fmt.Errorf("failed to fetch user @%s for GET /github/users/{username}: %w", username, err)
			w.WriteHeader(webhound_fetching.StatusCodeForError(err))
			encoder.Encode(err.Error())
			return
		}

		w.WriteHeader(http.StatusOK)
		encoder.Encode(user_dto)
	})
}
