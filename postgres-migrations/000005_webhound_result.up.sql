CREATE TABLE webhound.result (
    id       bigserial   PRIMARY KEY,
    service  text        NOT NULL,
    user_id  text        NOT NULL
);