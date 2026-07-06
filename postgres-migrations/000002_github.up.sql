CREATE SCHEMA github;

CREATE TABLE github.pfp (
    id           serial      PRIMARY KEY,
    image_data   bytea       NOT NULL
);

CREATE TABLE github.user (
    id         serial   PRIMARY KEY,
    username   text     NOT NULL UNIQUE,
    pfp_id     int      REFERENCES github.pfp (id)
);

CREATE TABLE github.follows (
    followee_id   int   NOT NULL REFERENCES github.user (id),
    follower_id   int   NOT NULL REFERENCES github.user (id),

    PRIMARY KEY (followee_id, follower_id)
);

CREATE TABLE github.request (
    id        serial   PRIMARY KEY,
    core_id   int      REFERENCES core.request (id) NOT NULL UNIQUE,
    result    int      REFERENCES github.user (id)
);
