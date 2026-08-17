FROM golang:1.26 AS build

WORKDIR /src

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN go install github.com/swaggo/swag/cmd/swag@v1.16.6 && \
    dirs="./cmd"; for dir in ./entities/*/transport; do dirs="$dirs,$dir"; done; \
    swag init --dir "$dirs" --output ./docs --parseDependency --parseInternal

RUN CGO_ENABLED=0 go build -o /webhound ./cmd/main.go

FROM alpine:3.20

RUN apk add --no-cache ca-certificates

COPY --from=build /webhound /usr/local/bin/webhound

EXPOSE 8080

ENTRYPOINT ["webhound"]