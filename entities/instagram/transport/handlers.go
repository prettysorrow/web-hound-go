package webhound_instagram_transport

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	database "go.mod/entities/instagram/database"
)

// @Summary      Get Instagram user by username
// @Description  Retrieve an Instagram user profile including followers, followees and posts. Private users return a reduced response.
// @Tags         instagram
// @Accept       json
// @Produce      json
// @Param        username path string true "Instagram username"
// @Success      200 {object} webhound_instagram_transport.InstagramUserPublicInfo "Instagram user found"
// @Failure      400 {object} string "User not found or database error"
// @Router       /api/instagram/users/{username} [get]
func AddGetInstagramUserHandler(router chi.Router, db *pgxpool.Pool, ctx context.Context) {
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

		if user.Kind == "private" {
			w.WriteHeader(http.StatusOK)
			encoder.Encode(InstagramUserPrivate{Kind: user.Kind, Username: user.Username, PfpUrl: user.PfpUrl})
			return
		}

		followees_entity, err := database.SelectInstagramFollowees(db, ctx, user.Id)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			encoder.Encode(fmt.Errorf("failed to get instagram user: failed to select followees: %w", err).Error())
			return
		}

		followers_entity, err := database.SelectInstagramFollowers(db, ctx, user.Id)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			encoder.Encode(fmt.Errorf("failed to get instagram user: failed to select followers: %w", err).Error())
			return
		}

		followees := make([]InstagramUserShort, 0, len(followees_entity))
		for _, followee := range followees_entity {
			followees = append(followees, InstagramUserShort{Kind: "short", Username: followee.Username, PfpUrl: followee.PfpUrl})
		}

		followers := make([]InstagramUserShort, 0, len(followers_entity))
		for _, follower := range followers_entity {
			followers = append(followers, InstagramUserShort{Kind: "short", Username: follower.Username, PfpUrl: follower.PfpUrl})
		}

		posts_entity, err := database.SelectInstagramPostsByUserId(db, ctx, user.Id)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			encoder.Encode(fmt.Errorf("failed to get instagram user: failed to select posts: %w", err).Error())
			return
		}

		var posts *InstagramPost
		if len(posts_entity) > 0 {
			post_entity := posts_entity[0]

			media_entity, err := database.SelectInstagramMediaByPostId(db, ctx, post_entity.Id)
			if err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				encoder.Encode(fmt.Errorf("failed to get instagram user: failed to select media: %w", err).Error())
				return
			}

			media := make([]InstagramMedia, 0, len(media_entity))
			for _, m := range media_entity {
				media = append(media, InstagramMedia{Kind: m.Kind, Url: m.Url})
			}

			posts = &InstagramPost{Description: post_entity.Description, Media: media}
		}

		w.WriteHeader(http.StatusOK)
		encoder.Encode(InstagramUserPublicInfo{
			Kind:      user.Kind,
			Username:  user.Username,
			PfpUrl:    user.PfpUrl,
			Followees: followees,
			Followers: followers,
			Posts:     posts,
		})
	})
}

// @Summary      Create an Instagram user
// @Description  Register a new Instagram user (public or private) with follows
// @Tags         instagram
// @Accept       json
// @Produce      json
// @Param        user body webhound_instagram_transport.InstagramUserPublic true "Instagram user data"
// @Success      200 {object} webhound_instagram_transport.InstagramUserPublic "Instagram user created successfully"
// @Failure      400 {object} string "Invalid input"
// @Failure      500 {object} string "Database error"
// @Router       /api/instagram/users [post]
func AddPostInstagramUser(router chi.Router, db *pgxpool.Pool, ctx context.Context) {
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
