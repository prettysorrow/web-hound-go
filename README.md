# web-hound-go-backend


ai b2b saas hft crypto startup (claude wrapper)


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
```

So you will be able to:
- Manage PostgreSQL database via `pgweb`
- Interact with backend RESTful API via `swag`


---


Then use these ones to tear down the environment:
```sh
python3 scripts/postgres.py pgweb-down
python3 scripts/postgres.py server-down             # stop postgres server
python3 scripts/postgres.py clean-up                # drop postgres database
```
