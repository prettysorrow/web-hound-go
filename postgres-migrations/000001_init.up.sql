CREATE SCHEMA core;

CREATE TABLE core.user (
    id             serial   PRIMARY KEY,
    display_name   text     NOT NULL,
    used_service   text     NOT NULL CHECK (used_service IN ( 'telegram', 'web-api' ))
);

CREATE TABLE core.request (
    id           serial        PRIMARY KEY,
    created_at   timestamptz   NOT NULL,
    created_on   text          NOT NULL,
    created_by   int           NOT NULL REFERENCES core.user (id)
);
