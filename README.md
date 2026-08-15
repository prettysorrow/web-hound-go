# web-hound-go

Simple web scrapper (WIP)


---


## Environment configuration

All configuration lives in a single `.env` file at the repository root
(paths, ports and secrets). Copy the template first:

```sh
cp .env.example .env
```

Fill in your secrets (postgres password, instagram credentials, etc.).
`VITE_*` variables are read by the React frontend, `FETCHING_*` by the
Python fetching service, the rest by the Go backend, scripts and
`docker-compose.yml`.

If you use direnv, `.envrc` will load the variables into your shell. The
scripts and services also load `.env` on their own.


---


Check `scripts/` for supported features:
```sh
for script in scripts/*; do "$script" --help; done
```


---


Your best options are:
```sh
python3 scripts/postgres.py server-up               # start postgresql server
python3 scripts/postgres.py migrate-up              # apply all migrations
python3 scripts/postgres.py pgweb-up                # start pgweb server

go install github.com/swaggo/swag/cmd/swag@latest   # install swag
python3 scripts/swag.py dev                         # start backend server with swag web ui

python3 scripts/fetching.py server                  # start external fetching service (FastAPI)
```

So you will be able to:
- Manage PostgreSQL database via `pgweb`
- Interact with backend RESTful API via `swag`
- Fetch GitHub / Instagram data from external services


---


## How requests are served (GitHub & Instagram)

The Go backend acts as an intermediary between the database, the external
fetching service (`fetching/`, a FastAPI app) and the frontend:

1. A `GET /api/{github,instagram}/users/{username}` request first reads the
   user from the database (cache).
2. If the user is not cached with full details, the backend asks the external
   fetching service (`http://{FETCHING_SERVER_HOST}:{FETCHING_SERVER_PORT}`,
   default `127.0.0.1:8090`), stores the result in the database
   (write-through cache) and returns it.
3. Subsequent requests for the same user are served from the database.

`enabled-services` in `settings/fetching-settings.json` controls which
services the fetching service exposes. Instagram requires `INSTAGRAM_LOGIN`
and `INSTAGRAM_PASSWORD` in `.env`; without them the fetching service starts
but skips instagram with a warning.


---


Then use these ones to tear down the environment:
```sh
python3 scripts/postgres.py pgweb-down
python3 scripts/postgres.py server-down             # stop postgres server
python3 scripts/postgres.py clean-up                # drop postgres database
```
