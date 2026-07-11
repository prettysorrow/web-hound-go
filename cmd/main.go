package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"

	"github.com/rs/zerolog"
	database "go.mod/database"
	services "go.mod/services"
	transport "go.mod/transport"
)

func main() {
	connection_uri := database.MustGetConnectionStringFromEnv()

	db, err := database.Connect(connection_uri)
	if err != nil {
		panic(err)
	}

	mux := http.NewServeMux()

	transport.AddGetUserHandler(mux, db)
	transport.AddPostUserHandler(mux, db)
	transport.AddGetUsersHandler(mux, db)

	mux.HandleFunc("/hello-world", func(w http.ResponseWriter, r *http.Request) {
		encode := json.NewEncoder(w)
		w.WriteHeader(http.StatusOK)
		encode.Encode("hello world")
	})

	logger := zerolog.New(os.Stdout).With().Timestamp().Logger()
	handler := services.LoggerMiddleware(logger)(mux)

	fmt.Println("started on http://localhost:8080")

	err = http.ListenAndServe("localhost:8080", handler)
	if err != nil {
		panic(err)
	}
}
