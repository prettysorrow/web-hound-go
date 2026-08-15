package webhound_instagram_transport

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
	webhound_fetching "go.mod/services/fetching"
)

// @Summary      Get Instagram user by username
// @Description  Retrieve an Instagram user profile including followers, followees and posts. Fetches from the external fetching service on demand and serves the result from an in-memory cache afterwards. While the background fetch is still running the response carries a partial graph with status "in_progress". Private users return a reduced response.
// @Tags         instagram
// @Accept       json
// @Produce      json
// @Param        username path string true "Instagram username"
// @Param        follow_limit query int false "Maximum number of followees/followers to fetch (defaults to the fetching service limit)"
// @Success      200 {object} webhound_instagram_transport.InstagramUserPublicInfo "Instagram user found"
// @Failure      400 {object} string "User not found or fetching error"
// @Router       /api/instagram/users/{username} [get]
func AddGetInstagramUserHandler(router chi.Router, fetching *webhound_fetching.Client, ctx context.Context) {
	router.Get("/api/instagram/users/{username}", func(w http.ResponseWriter, r *http.Request) {
		encoder := json.NewEncoder(w)
		w.Header().Add("Content-Type", "application/json")

		username := chi.URLParam(r, "username")
		followLimit := parseFollowLimitQuery(r)

		user_info, err := GetInstagramUserOrFetch(ctx, fetching, username, followLimit)
		if err != nil {
			w.WriteHeader(webhound_fetching.StatusCodeForError(err))
			encoder.Encode(fmt.Errorf("failed to get instagram user: %w", err).Error())
			return
		}

		w.WriteHeader(http.StatusOK)
		encoder.Encode(user_info)
	})
}

// parseFollowLimitQuery reads the optional follow_limit query parameter. It
// returns 0 when the parameter is absent or invalid, meaning "use the default".
func parseFollowLimitQuery(r *http.Request) int {
	raw := r.URL.Query().Get("follow_limit")
	if raw == "" {
		return 0
	}
	n, err := strconv.Atoi(raw)
	if err != nil || n < 1 {
		return 0
	}
	return n
}
