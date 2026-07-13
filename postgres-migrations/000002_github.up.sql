CREATE SCHEMA github;

CREATE TABLE github.user (
    id         serial   PRIMARY KEY,
    username   text     NOT NULL UNIQUE,
    pfp        bytea    NULL
);

CREATE TABLE github.follows (
    followee_id   int   NOT NULL REFERENCES github.user (id),
    follower_id   int   NOT NULL REFERENCES github.user (id),

    PRIMARY KEY (followee_id, follower_id)
);
