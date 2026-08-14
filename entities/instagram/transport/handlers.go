package webhound_instagram_transport

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/jackc/pgx/v5"
	database "go.mod/entities/instagram/database"
)

func AddGetInstagramUserHandler(router chi.Router, db *pgx.Conn, ctx context.Context) {
	router.Get("/api/instagram/users/{username}", func(w http.ResponseWriter, r *http.Request) {
		encoder := json.NewEncoder(w)
		w.Header().Add("Content-Type", "application/json")

		username := chi.URLParam(r, "username")

		user, err := database.SelectInstagramUserByUsername(db, ctx, username)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			encoder.Encode(fmt.Errorf("failed to get instagram user: %w", err).Error())
			return
		}

		w.WriteHeader(http.StatusOK)
		encoder.Encode(user)
	})
}

func AddPostInstagramUser(router chi.Router, db *pgx.Conn, ctx context.Context) {
	router.Post("/api/instagram/users", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Add("Content-Type", "application/json")
		encoder := json.NewEncoder(w)

		bytes, err := io.ReadAll(r.Body)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			encoder.Encode(fmt.Errorf("failed to post instagram user: failed to read body: %w", err).Error())
			return
		}

		var data map[string]any
		if err := json.Unmarshal(bytes, &data); err != nil {
			w.WriteHeader(http.StatusBadRequest)
			encoder.Encode(fmt.Errorf("failed to post instagram user: failed to parse body: %w", err).Error())
			return
		}

		var kind string
		{
			kindAny, ok := data["kind"]
			if !ok {
				w.WriteHeader(http.StatusBadRequest)
				encoder.Encode(fmt.Errorf("failed to post instagram user: object has no 'kind' property").Error())
				return
			}

			kind, ok = kindAny.(string)
			if !ok || (kind != "private" && kind != "public") {
				w.WriteHeader(http.StatusBadRequest)
				encoder.Encode(fmt.Errorf("failed to post instagram user: 'kind' must be either 'private' or 'public'").Error())
				return
			}
		}

		if kind == "public" {
			var user InstagramUserPublic
			if err := json.Unmarshal(bytes, &user); err != nil {
				w.WriteHeader(http.StatusBadRequest)
				encoder.Encode(fmt.Errorf("failed to post instagram user: failed to parse user from body: %w", err).Error())
				return
			}

			userEntity, err := database.InsertInstagramUser(db, ctx, &database.InsertInstagramUserInput{Kind: user.Kind, Username: user.Username, PfpUrl: user.PfpUrl})
			if err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				encoder.Encode(fmt.Errorf("failed to post instagram user: failed to insert user to database: %w", err).Error())
				return
			}

			for _, followee := range user.Followees {
				followeeEntity, err := database.InsertInstagramUser(db, ctx, &database.InsertInstagramUserInput{Kind: followee.Kind, Username: followee.Username, PfpUrl: followee.PfpUrl})
				if err != nil {
					w.WriteHeader(http.StatusInternalServerError)
					encoder.Encode(fmt.Errorf("failed to post instagram user: failed to insert followee to database: %w", err).Error())
					return
				}

				if err := database.InsertInstagramFollows(db, ctx, &database.InsertInstagramFollowsInput{FolloweeId: followeeEntity.Id, FollowerId: userEntity.Id}); err != nil {
					w.WriteHeader(http.StatusInternalServerError)
					encoder.Encode(fmt.Errorf("failed to post instagram user: failed to insert follows to database: %w", err).Error())
					return
				}
			}

			for _, follower := range user.Followers {
				followerEntity, err := database.InsertInstagramUser(db, ctx, &database.InsertInstagramUserInput{Kind: follower.Kind, Username: follower.Username, PfpUrl: follower.PfpUrl})
				if err != nil {
					w.WriteHeader(http.StatusInternalServerError)
					encoder.Encode(fmt.Errorf("failed to post instagram user: failed to insert follower to database: %w", err).Error())
					return
				}

				if err := database.InsertInstagramFollows(db, ctx, &database.InsertInstagramFollowsInput{FolloweeId: userEntity.Id, FollowerId: followerEntity.Id}); err != nil {
					w.WriteHeader(http.StatusInternalServerError)
					encoder.Encode(fmt.Errorf("failed to post instagram user: failed to insert follows to database: %w", err).Error())
					return
				}
			}

			w.WriteHeader(http.StatusOK)
			encoder.Encode(user)
			return
		}

		if kind == "private" {
			var user InstagramUserPrivate
			if err := json.Unmarshal(bytes, &user); err != nil {
				w.WriteHeader(http.StatusBadRequest)
				encoder.Encode(fmt.Errorf("failed to post instagram user: failed to parse user from body: %w", err).Error())
				return
			}

			_, err := database.InsertInstagramUser(db, ctx, &database.InsertInstagramUserInput{Kind: user.Kind, Username: user.Username, PfpUrl: user.PfpUrl})
			if err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				encoder.Encode(fmt.Errorf("failed to post instagram user: failed to insert user to database: %w", err).Error())
				return
			}

			w.WriteHeader(http.StatusOK)
			encoder.Encode(user)
			return
		}

		panic("should not happen")
	})
}
