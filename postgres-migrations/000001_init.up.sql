CREATE SCHEMA core;

CREATE TABLE core.user (
    id             serial   PRIMARY KEY,
    display_name   text     NOT NULL,
    used_service   text     NOT NULL CHECK (used_service IN ( 'telegram', 'web-api' )),
    service_id     text     NOT NULL,
    UNIQUE (used_service, service_id)
);

CREATE TABLE core.request (
    id           serial        PRIMARY KEY,
    created_at   timestamptz   NOT NULL DEFAULT now(),
    created_on   text          NOT NULL,
    created_by   int           NOT NULL REFERENCES core.user (id),
    results      jsonb         NOT NULL DEFAULT '[]'
);
