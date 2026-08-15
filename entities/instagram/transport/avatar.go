package webhound_instagram_transport

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	database "go.mod/entities/instagram/database"
)

// @Summary      Get Instagram user avatar
// @Description  Proxy a cached Instagram avatar so the browser does not hit Instagram's CDN directly (which blocks hotlinking and requires the fetching session). Reads the cached pfp URL from the database and streams the image through this backend.
// @Tags         instagram
// @Accept       json
// @Produce      application/octet-stream
// @Param        username path string true "Instagram username"
// @Success      200 {file} binary "Avatar image"
// @Failure      404 {object} string "No avatar cached for the user"
// @Failure      502 {object} string "Failed to fetch the upstream avatar"
// @Router       /api/instagram/avatars/{username} [get]
func AddGetInstagramAvatarHandler(router chi.Router, db *pgxpool.Pool, ctx context.Context) {
	client := &http.Client{Timeout: 30 * time.Second}

	router.Get("/api/instagram/avatars/{username}", func(w http.ResponseWriter, r *http.Request) {
		encoder := json.NewEncoder(w)
		w.Header().Add("Content-Type", "application/json")

		username := chi.URLParam(r, "username")
		user, err := database.SelectInstagramUserByUsername(db, ctx, username)
		if err != nil {
			w.WriteHeader(http.StatusNotFound)
			encoder.Encode(fmt.Sprintf("no avatar cached for @%s", username))
			return
		}
		if user.PfpUrl == "" {
			w.WriteHeader(http.StatusNotFound)
			encoder.Encode(fmt.Sprintf("no avatar cached for @%s", username))
			return
		}

		resp, err := client.Get(user.PfpUrl)
		if err != nil {
			w.WriteHeader(http.StatusBadGateway)
			encoder.Encode(fmt.Sprintf("failed to fetch avatar for @%s: %v", username, err))
			return
		}
		defer resp.Body.Close()

		if resp.StatusCode != http.StatusOK {
			w.WriteHeader(http.StatusBadGateway)
			encoder.Encode(fmt.Sprintf("upstream avatar fetch for @%s returned status %d", username, resp.StatusCode))
			return
		}

		if contentType := resp.Header.Get("Content-Type"); contentType != "" {
			w.Header().Set("Content-Type", contentType)
		} else {
			w.Header().Set("Content-Type", "application/octet-stream")
		}
		w.Header().Set("Cache-Control", "public, max-age=86400")
		w.WriteHeader(http.StatusOK)
		io.Copy(w, resp.Body)
	})
}
