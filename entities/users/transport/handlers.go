package webhound_users_transport

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	"github.com/jackc/pgx/v5"
)

func AddGetUserHandler(mux *http.ServeMux, db *pgx.Conn) {
	mux.HandleFunc("GET /users/{id}", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		encoder := json.NewEncoder(w)

		id, err := strconv.ParseInt(r.PathValue("id"), 10, 64)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			err = fmt.Errorf("failed to handle GET /users/{id} request: failed to parse id: %w", err)
			encoder.Encode(err.Error())
			return
		}

		input_for_db := GetUserInput{Id: id}
		user, err := GetUser(db, input_for_db)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			err = fmt.Errorf("failed to handle GET /users/{id} request: %w", err)
			encoder.Encode(err.Error())
			return
		}

		w.WriteHeader(http.StatusOK)
		encoder.Encode(user)
	})
}

func AddPostUserHandler(mux *http.ServeMux, db *pgx.Conn) {
	mux.HandleFunc("POST /users", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Add("Content-Type", "application/json")
		encoder := json.NewEncoder(w)
		decoder := json.NewDecoder(r.Body)

		var user PostUserInput
		err := decoder.Decode(&user)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			err = fmt.Errorf("failed to handle POST /users request: failed to parse user: %w", err)
			encoder.Encode(err.Error())
			return
		}

		result, err := PostUser(db, user)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			err = fmt.Errorf("failed to handle POST /users request: failed to insert user into database: %w", err)
			encoder.Encode(err.Error())
			return
		}

		w.WriteHeader(http.StatusOK)
		encoder.Encode(result)
	})
}

func AddGetUsersHandler(mux *http.ServeMux, db *pgx.Conn) {
	mux.HandleFunc("GET /users", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Add("Content-Type", "application/json")
		encoder := json.NewEncoder(w)

		input_for_db := GetUsersInput{}
		result, err := GetUsers(db, input_for_db)

		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			err = fmt.Errorf("failed to handle GET /users request: %w", err)
			encoder.Encode(err.Error())
			return
		}

		w.WriteHeader(http.StatusOK)
		encoder.Encode(result)
	})
}
