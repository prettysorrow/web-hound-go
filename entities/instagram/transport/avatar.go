package webhound_instagram_transport

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
)

// @Summary      Get Instagram user avatar
// @Description  Proxy a cached Instagram avatar so the browser does not hit Instagram's CDN directly (which blocks hotlinking and requires the fetching session). Looks the cached pfp URL up in the in-memory cache and streams the image through this backend.
// @Tags         instagram
// @Accept       json
// @Produce      application/octet-stream
// @Param        username path string true "Instagram username"
// @Success      200 {file} binary "Avatar image"
// @Failure      404 {object} string "No avatar cached for the user"
// @Failure      502 {object} string "Failed to fetch the upstream avatar"
// @Router       /api/instagram/avatars/{username} [get]
func AddGetInstagramAvatarHandler(router chi.Router, ctx context.Context) {
	client := &http.Client{Timeout: 30 * time.Second}

	router.Get("/api/instagram/avatars/{username}", func(w http.ResponseWriter, r *http.Request) {
		encoder := json.NewEncoder(w)
		w.Header().Add("Content-Type", "application/json")

		username := chi.URLParam(r, "username")
		avatar, ok := instagramAvatarFor(username)
		if !ok {
			w.WriteHeader(http.StatusNotFound)
			encoder.Encode(fmt.Sprintf("no avatar cached for @%s", username))
			return
		}

		resp, err := client.Get(avatar)
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

// instagramAvatarFor finds the cached avatar URL for a username across all
// in-memory instagram graphs (main profiles and connections alike).
func instagramAvatarFor(username string) (string, bool) {
	jobsMu.Lock()
	defer jobsMu.Unlock()

	for _, job := range jobs {
		job.mu.Lock()
		avatar := ""
		found := false

		if job.username == username && job.pfpUrl != "" {
			avatar, found = job.pfpUrl, true
		}
		if !found {
			for _, follower := range job.followers {
				if follower.Username == username && follower.PfpUrl != "" {
					avatar, found = follower.PfpUrl, true
					break
				}
			}
		}
		if !found {
			for _, followee := range job.followees {
				if followee.Username == username && followee.PfpUrl != "" {
					avatar, found = followee.PfpUrl, true
					break
				}
			}
		}

		job.mu.Unlock()
		if found {
			return avatar, true
		}
	}

	return "", false
}
