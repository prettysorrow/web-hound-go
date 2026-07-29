CREATE SCHEMA github;

CREATE TABLE github.user (
    id         bigserial   PRIMARY KEY,
    "verbose"  boolean     NOT NULL,
    username   text        NOT NULL UNIQUE,
    pfp_url    text        NULL
);

CREATE TABLE github.follows (
    followee_id   bigint   NOT NULL REFERENCES github.user (id),
    follower_id   bigint   NOT NULL REFERENCES github.user (id),

    PRIMARY KEY (followee_id, follower_id)
);
