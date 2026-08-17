package webhound_services

import (
	"bytes"
	"fmt"
	"io"
	"net/http"
	"os"
	"time"

	"github.com/rs/zerolog"
)

type ResponseWriterWithStatus struct {
	http.ResponseWriter
	status int
}

func (w *ResponseWriterWithStatus) WriteHeader(code int) {
	w.status = code
	w.ResponseWriter.WriteHeader(code)
}

func LoggerMiddleware(log zerolog.Logger) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			start := time.Now()
			writer := &ResponseWriterWithStatus{ResponseWriter: w}
			next.ServeHTTP(writer, r)

			msg := log.Info().
				Str("method", r.Method).
				Str("request uri", r.RequestURI).
				Int("status", writer.status).
				Dur("duration", time.Since(start))

			if r.Body != nil {
				body, err := io.ReadAll(r.Body)

				if err != nil {
					msg.Msg("")
					err = fmt.Errorf("failed to log request body: %w", err)
					log.Warn().Err(err).Msg("")
					return
				} else {
					msg.Str("body", string(body)).Msg("")
				}

				r.Body = io.NopCloser(bytes.NewReader(body))
			} else {
				err := fmt.Errorf("request body is null")
				err = fmt.Errorf("failed to log request body: %w", err)
				msg.Msg("")
				log.Warn().Err(err).Msg("")
			}
		})
	}
}

var (
	Logger zerolog.Logger = zerolog.New(os.Stdout).With().Timestamp().Logger()
)
