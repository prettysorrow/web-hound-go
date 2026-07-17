package webhound_telegram_transport

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/jackc/pgx/v5"
	database "go.mod/entities/telegram/database"
	services "go.mod/services"
)

func AddPostUserHandler(r *chi.Mux, db *pgx.Conn, ctx context.Context) {
	r.Post("/telegram/users", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Add("Content-Type", "application/json")

		encoder := json.NewEncoder(w)
		decoder := json.NewDecoder(r.Body)

		// unmarshal user from body
		var user User
		if err := decoder.Decode(&user); err != nil {
			w.WriteHeader(http.StatusBadRequest)
			if err := encoder.Encode(fmt.Errorf("failed to post user: failed to unmarshal body: failed to unmarshal user: %v", err).Error()); err != nil {
				services.Logger.Warn().Err(err).Msg("failed to send 400 to client")
			}

			return
		}

		// insert channel
		var channel_id *int64
		if user.Channel != nil {
			channel_entity, err := database.InsertChannel(db, ctx, &database.InsertChannelRequest{
				Url:  user.Channel.Url,
				Name: user.Channel.Name,
				Bio:  user.Channel.Bio,
			})

			if err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				if err := encoder.Encode(fmt.Errorf("failed to post user: failed to post user's channel: database internal error: %v", err).Error()); err != nil {
					services.Logger.Warn().Err(err).Msg("failed to send 500 to client")
				}

				return
			}

			channel_id = &channel_entity.Id
		}

		// insert user with specified channel
		user_entity, err := database.InsertUser(db, ctx, &database.InsertUserRequest{
			Username:  user.Username,
			FirstName: user.FirstName,
			LastName:  user.LastName,
			Phone:     user.Phone,
			Bio:       user.Bio,
			ChannelId: channel_id,
		})

		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			if err := encoder.Encode(fmt.Errorf("failed to post user: database internal error: %v", err).Error()); err != nil {
				services.Logger.Warn().Err(err).Msg("failed to send 500 to client")
			}

			return
		}

		// insert profile photos
		for _, photo := range user.Photos {
			_, err := database.InsertProfilePhoto(db, ctx, &database.InsertProfilePhotoRequest{
				UserId:    user_entity.Id,
				ImageData: photo.ImageData,
			})

			if err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				if err := encoder.Encode(fmt.Errorf("failed to post user: failed to post profile photo: database internal error: %v", err).Error()); err != nil {
					services.Logger.Warn().Err(err).Msg("failed to send 500 to client")
				}

				return
			}
		}

		if user.Channel != nil {
			// insert channel photos
			for _, photo := range user.Channel.Photos {
				_, err := database.InsertChannelPhoto(db, ctx, &database.InsertChannelPhotoRequest{
					ChannelId: *channel_id,
					ImageData: photo.ImageData,
				})

				if err != nil {
					w.WriteHeader(http.StatusInternalServerError)
					if err := encoder.Encode(fmt.Errorf("failed to post user: failed to post channel photo: database internal error: %v", err).Error()); err != nil {
						services.Logger.Warn().Err(err).Msg("failed to send 500 to client")
					}

					return
				}
			}

			// insert channel post photos
			for _, photo := range user.Channel.PostsPhotos {
				_, err := database.InsertChannelPostPhoto(db, ctx, &database.InsertChannelPostPhotoRequest{
					ChannelId: *channel_id,
					ImageData: photo.ImageData,
				})

				if err != nil {
					w.WriteHeader(http.StatusInternalServerError)
					if err := encoder.Encode(fmt.Errorf("failed to post user: failed to post channel post photo: database internal error: %v", err).Error()); err != nil {
						services.Logger.Warn().Err(err).Msg("failed to send 500 to client")
					}

					return
				}
			}
		}

		// ok
		services.Logger.Info().Msg(fmt.Sprintf("posted user with username=%s", user.Username))
		w.WriteHeader(http.StatusOK)
		encoder.Encode(user)
	})
}

func AddGetUserHandler(router *chi.Mux, db *pgx.Conn, ctx context.Context) {
	router.Get("/telegram/users/{username}", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Add("Content-Type", "application/json")

		encoder := json.NewEncoder(w)

		// parse username from url
		username := chi.URLParam(r, "username")
		if username == "" {
			w.WriteHeader(http.StatusBadRequest)

			if err := encoder.Encode(fmt.Errorf("failed to get user by username: failed to parse username from url").Error()); err != nil {
				services.Logger.Warn().Err(err).Msg("failed to send 400 to cliend")
			}

			return
		}

		// fetch entity user
		user_entity, err := database.SelectUserByUsername(db, ctx, username)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError) // TODO: handle not found

			if err := encoder.Encode(fmt.Errorf("failed to get user by username: internal database error: %v", err).Error()); err != nil {
				services.Logger.Warn().Err(err).Msg("failed to send 500 to cliend")
			}

			return
		}

		var user User
		user.Username = user_entity.Username
		user.FirstName = user_entity.FirstName
		user.LastName = user_entity.LastName
		user.Phone = user_entity.Phone
		user.Bio = user_entity.Bio

		// fetch profile photos
		profile_photos, err := database.SelectProfilePhotos(db, ctx, user_entity.Id)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)

			if err := encoder.Encode(fmt.Errorf("failed to get user by username: failed to get profile photos: %v", err).Error()); err != nil {
				services.Logger.Warn().Err(err).Msg("failed to send 500 to cliend")
			}

			return
		}

		// collect profile photos
		for _, photo := range profile_photos {
			user.Photos = append(user.Photos, Photo{ImageData: photo.ImageData})
		}

		// get photos from channel and channel posts
		if user_entity.ChannelId != nil {

			// fetch channel
			channel_entity, err := database.SelectChannelById(db, ctx, *user_entity.ChannelId)
			if err != nil {
				w.WriteHeader(http.StatusInternalServerError)

				if err := encoder.Encode(fmt.Errorf("failed to get user by username: failed to get user's channel: %v", err).Error()); err != nil {
					services.Logger.Warn().Err(err).Msg("failed to send 500 to cliend")
				}

				return
			}

			var channel Channel
			channel.Url = channel_entity.Url
			channel.Name = channel_entity.Name
			channel.Bio = channel_entity.Bio

			// fetch channel photos
			channel_photos, err := database.SelectChannelPhotos(db, ctx, channel_entity.Id)
			if err != nil {
				w.WriteHeader(http.StatusInternalServerError)

				if err := encoder.Encode(fmt.Errorf("failed to get user by username: failed to get channel photos: %v", err).Error()); err != nil {
					services.Logger.Warn().Err(err).Msg("failed to send 500 to cliend")
				}

				return
			}

			// collect channel photos
			for _, entity_photo := range channel_photos {
				channel.Photos = append(channel.Photos, Photo{ImageData: entity_photo.ImageData})
			}

			// fetch channel posts photos
			channel_posts_photos, err := database.SelectChannelPostsPhotos(db, ctx, channel_entity.Id)
			if err != nil {
				w.WriteHeader(http.StatusInternalServerError)

				if err := encoder.Encode(fmt.Errorf("failed to get user by username: failed to get channel posts photos: %v", err).Error()); err != nil {
					services.Logger.Warn().Err(err).Msg("failed to send 500 to cliend")
				}

				return
			}

			// collect channel posts photos
			for _, entity_photo := range channel_posts_photos {
				channel.PostsPhotos = append(channel.PostsPhotos, Photo{ImageData: entity_photo.ImageData})
			}

			user.Channel = &channel
		}

		// ok
		services.Logger.Info().Msg(fmt.Sprintf("returned user with username = %s", username))
		w.WriteHeader(http.StatusOK)
		encoder.Encode(user)
	})
}
