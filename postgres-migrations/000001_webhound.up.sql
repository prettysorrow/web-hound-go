CREATE SCHEMA webhound;

CREATE TABLE webhound.user (
    id             serial   PRIMARY KEY,
    display_name   text     NOT NULL,
    used_service   text     NOT NULL CHECK (used_service IN ( 'gmail', 'github' )),
    service_id     text     NOT NULL,
    UNIQUE (used_service, service_id)
);

CREATE TABLE webhound.request (
    id           bigserial     PRIMARY KEY,
    created_at   timestamptz   NOT NULL DEFAULT now(),
    created_on   text          NOT NULL,
    created_by   bigint        NOT NULL REFERENCES webhound.user (id),
    results_ids  bigint[]      NOT NULL DEFAULT '{}'
);
