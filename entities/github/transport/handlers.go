package webhound_github_transport

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/jackc/pgx/v5"
)

func AddGetUserHandler(r *chi.Mux, db *pgx.Conn, ctx context.Context) {
	r.Get("/github/users/{username}", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Add("Content-Type", "application/json")
		encoder := json.NewEncoder(w)

		username := chi.URLParam(r, "username")

		user_dto, err := GetUserDto(db, ctx, username)
		if err != nil {
			err = fmt.Errorf("failed to fetch user @%s from database for GET /github/users/{username}: %w", username, err)
			w.WriteHeader(http.StatusBadRequest)
			encoder.Encode(err.Error())
			return
		}

		w.WriteHeader(http.StatusOK)
		encoder.Encode(user_dto)
	})
}

func AddPostUserHandler(r *chi.Mux, db *pgx.Conn, ctx context.Context) {
	r.Post("/github/users", func(w http.ResponseWriter, r *http.Request) {
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
