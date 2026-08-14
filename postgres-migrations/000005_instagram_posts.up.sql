create table instagram.post (
    id          bigserial primary key,
    user_id     bigint  not null references instagram.user (id),
    description text    not null
);

create table instagram.media (
    id      bigserial primary key,
    post_id bigint not null references instagram.post (id),
    kind    text   not null check (kind in ( 'photo', 'video' )),
    url     text   not null
);
