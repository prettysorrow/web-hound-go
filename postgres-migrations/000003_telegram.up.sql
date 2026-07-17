CREATE SCHEMA telegram;

CREATE TABLE telegram.channel (
    "id"   bigserial PRIMARY KEY,
    "url"  text      UNIQUE NOT NULL,
    "name" text      NOT NULL,
    "bio"  text      NULL
);

CREATE TABLE telegram.user (
    "id"         bigserial PRIMARY KEY,
    "username"   text      UNIQUE NOT NULL,
    "first_name" text      NOT NULL,
    "last_name"  text      NULL,
    "phone"      text      NULL,
    "bio"        text      NULL, 
    "channel_id" bigint REFERENCES telegram.channel ("id")
);

CREATE TABLE telegram.photo (
    "id"         bigserial PRIMARY KEY,
    "image_data" bytea
);

CREATE TABLE telegram.profile_photo (
    "photo_id" bigint NOT NULL REFERENCES telegram.photo ("id"),
    "user_id"  bigint NOT NULL REFERENCES telegram.user ("id"),
    PRIMARY KEY ("photo_id", "user_id")
);

CREATE TABLE telegram.channel_photo (
    "photo_id" bigint NOT NULL REFERENCES telegram.photo ("id"),
    "channel_id"  bigint NOT NULL REFERENCES telegram.channel ("id"),
    PRIMARY KEY ("photo_id", "channel_id")
);

CREATE TABLE telegram.channel_post_photo (
    "photo_id" bigint NOT NULL REFERENCES telegram.photo ("id"),
    "channel_id"  bigint NOT NULL REFERENCES telegram.channel ("id"),
    PRIMARY KEY ("photo_id", "channel_id")
);
