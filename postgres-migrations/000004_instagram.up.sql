create schema "instagram";

create table "instagram"."user" (
    "id"       bigserial primary key,
    "kind"     text      not null check ("kind" in ( 'short', 'private', 'public' )),
    "username" text      unique not null,
    "pfp_url"  text      not null
);

create index "username_index" on "instagram"."user" ("username");

create table "instagram"."follows" (
    "followee_id" bigint not null references "instagram"."user" ("id"),
    "follower_id" bigint not null references "instagram"."user" ("id"),
    primary key ("followee_id", "follower_id")
);
