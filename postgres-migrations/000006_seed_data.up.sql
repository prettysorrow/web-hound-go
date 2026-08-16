-- =====================================================================
-- GitHub seed data
-- =====================================================================

insert into github.user ("verbose", username, pfp_url) values
(true, 'alex',            'https://picsum.photos/id/1011/200'),
(true, 'mia',             'https://picsum.photos/id/2002/200'),
(true, 'emma',            'https://picsum.photos/id/3003/200'),
(true, 'max',             'https://picsum.photos/id/4004/200'),
(true, 'secret_committer','https://picsum.photos/id/5005/200'),
(true, 'sunny',           'https://picsum.photos/id/6006/200'),
(true, 'cryptic',         'https://picsum.photos/id/7007/200'),
(true, 'luna',            'https://picsum.photos/id/8008/200'),
(true, 'leo',             'https://picsum.photos/id/9009/200'),
(true, 'ghost',           'https://picsum.photos/id/1010/200'),
(true, 'mike',            'https://picsum.photos/id/1/100'),
(true, 'open_source',     'https://picsum.photos/id/10/100'),
(true, 'react_ninja',     'https://picsum.photos/id/20/100'),
(true, 'buddy',           'https://picsum.photos/id/30/100'),
(true, 'js_lover',        'https://picsum.photos/id/40/100'),
(true, 'rustacean',       'https://picsum.photos/id/50/100'),
(true, 'junior',          'https://picsum.photos/id/60/100'),
(true, 'ella',            'https://picsum.photos/id/70/100'),
(true, 'wizard',          'https://picsum.photos/id/80/100'),
(true, 'john',            'https://picsum.photos/id/90/100'),
(true, 'library',         'https://picsum.photos/id/100/100'),
(true, 'poet',            'https://picsum.photos/id/110/100'),
(true, 'lucy',            'https://picsum.photos/id/120/100'),
(true, 'pro_gamer',       'https://picsum.photos/id/130/100'),
(true, 'club',            'https://picsum.photos/id/140/100'),
(true, 'beat',            'https://picsum.photos/id/150/100'),
(true, 'party',           'https://picsum.photos/id/160/100'),
(true, 'zen',             'https://picsum.photos/id/170/100'),
(true, 'ray',             'https://picsum.photos/id/180/100'),
(true, 'amy',             'https://picsum.photos/id/190/100'),
(true, 'calm',            'https://picsum.photos/id/210/100'),
(true, 'salute',          'https://picsum.photos/id/220/100'),
(true, 'collector',       'https://picsum.photos/id/230/100'),
(true, 'gallery',         'https://picsum.photos/id/240/100')
on conflict (username) do nothing;

insert into github.follows (followee_id, follower_id)
select fe.id, fo.id
from github.user fe, github.user fo
where fe.username = 'mike' and fo.username = 'alex'
on conflict do nothing;

insert into github.follows (followee_id, follower_id)
select fe.id, fo.id
from github.user fe, github.user fo
where fe.username = 'open_source' and fo.username = 'alex'
on conflict do nothing;

insert into github.follows (followee_id, follower_id)
select fe.id, fo.id
from github.user fe, github.user fo
where fe.username = 'react_ninja' and fo.username = 'alex'
on conflict do nothing;

insert into github.follows (followee_id, follower_id)
select fe.id, fo.id
from github.user fe, github.user fo
where fe.username = 'alex' and fo.username = 'buddy'
on conflict do nothing;

insert into github.follows (followee_id, follower_id)
select fe.id, fo.id
from github.user fe, github.user fo
where fe.username = 'alex' and fo.username = 'js_lover'
on conflict do nothing;

insert into github.follows (followee_id, follower_id)
select fe.id, fo.id
from github.user fe, github.user fo
where fe.username = 'rustacean' and fo.username = 'mia'
on conflict do nothing;

insert into github.follows (followee_id, follower_id)
select fe.id, fo.id
from github.user fe, github.user fo
where fe.username = 'mia' and fo.username = 'junior'
on conflict do nothing;

insert into github.follows (followee_id, follower_id)
select fe.id, fo.id
from github.user fe, github.user fo
where fe.username = 'mia' and fo.username = 'ella'
on conflict do nothing;

insert into github.follows (followee_id, follower_id)
select fe.id, fo.id
from github.user fe, github.user fo
where fe.username = 'mia' and fo.username = 'wizard'
on conflict do nothing;

insert into github.follows (followee_id, follower_id)
select fe.id, fo.id
from github.user fe, github.user fo
where fe.username = 'john' and fo.username = 'emma'
on conflict do nothing;

insert into github.follows (followee_id, follower_id)
select fe.id, fo.id
from github.user fe, github.user fo
where fe.username = 'library' and fo.username = 'emma'
on conflict do nothing;

insert into github.follows (followee_id, follower_id)
select fe.id, fo.id
from github.user fe, github.user fo
where fe.username = 'poet' and fo.username = 'emma'
on conflict do nothing;

insert into github.follows (followee_id, follower_id)
select fe.id, fo.id
from github.user fe, github.user fo
where fe.username = 'lucy' and fo.username = 'max'
on conflict do nothing;

insert into github.follows (followee_id, follower_id)
select fe.id, fo.id
from github.user fe, github.user fo
where fe.username = 'max' and fo.username = 'pro_gamer'
on conflict do nothing;

insert into github.follows (followee_id, follower_id)
select fe.id, fo.id
from github.user fe, github.user fo
where fe.username = 'club' and fo.username = 'sunny'
on conflict do nothing;

insert into github.follows (followee_id, follower_id)
select fe.id, fo.id
from github.user fe, github.user fo
where fe.username = 'beat' and fo.username = 'sunny'
on conflict do nothing;

insert into github.follows (followee_id, follower_id)
select fe.id, fo.id
from github.user fe, github.user fo
where fe.username = 'sunny' and fo.username = 'party'
on conflict do nothing;

insert into github.follows (followee_id, follower_id)
select fe.id, fo.id
from github.user fe, github.user fo
where fe.username = 'zen' and fo.username = 'luna'
on conflict do nothing;

insert into github.follows (followee_id, follower_id)
select fe.id, fo.id
from github.user fe, github.user fo
where fe.username = 'luna' and fo.username = 'ray'
on conflict do nothing;

insert into github.follows (followee_id, follower_id)
select fe.id, fo.id
from github.user fe, github.user fo
where fe.username = 'luna' and fo.username = 'amy'
on conflict do nothing;

insert into github.follows (followee_id, follower_id)
select fe.id, fo.id
from github.user fe, github.user fo
where fe.username = 'luna' and fo.username = 'calm'
on conflict do nothing;

insert into github.follows (followee_id, follower_id)
select fe.id, fo.id
from github.user fe, github.user fo
where fe.username = 'luna' and fo.username = 'salute'
on conflict do nothing;

insert into github.follows (followee_id, follower_id)
select fe.id, fo.id
from github.user fe, github.user fo
where fe.username = 'leo' and fo.username = 'collector'
on conflict do nothing;

insert into github.follows (followee_id, follower_id)
select fe.id, fo.id
from github.user fe, github.user fo
where fe.username = 'leo' and fo.username = 'gallery'
on conflict do nothing;

-- =====================================================================
-- Instagram seed data
-- =====================================================================

insert into instagram.user (kind, username, pfp_url) values
('public',  'alex',            'https://picsum.photos/id/101/200'),
('public',  'mia',             'https://picsum.photos/id/200/200'),
('public',  'emma',            'https://picsum.photos/id/300/200'),
('public',  'max',             'https://picsum.photos/id/400/200'),
('private', 'secret_admirer',  'https://picsum.photos/id/500/200'),
('public',  'sunny',           'https://picsum.photos/id/600/200'),
('private', 'cryptic',         'https://picsum.photos/id/700/200'),
('public',  'luna',            'https://picsum.photos/id/800/200'),
('public',  'leo',             'https://picsum.photos/id/900/200'),
('private', 'ghost',           'https://picsum.photos/id/1000/200'),
('public',  'mike',            'https://picsum.photos/id/1/100'),
('public',  'nature',          'https://picsum.photos/id/10/100'),
('public',  'city',            'https://picsum.photos/id/20/100'),
('public',  'buddy',           'https://picsum.photos/id/30/100'),
('public',  'wander',          'https://picsum.photos/id/40/100'),
('public',  'critic',          'https://picsum.photos/id/50/100'),
('public',  'joe',             'https://picsum.photos/id/60/100'),
('public',  'ella',            'https://picsum.photos/id/70/100'),
('public',  'sweet',           'https://picsum.photos/id/80/100'),
('public',  'john',            'https://picsum.photos/id/90/100'),
('public',  'library',         'https://picsum.photos/id/100/100'),
('public',  'poet',            'https://picsum.photos/id/110/100'),
('public',  'lucy',            'https://picsum.photos/id/120/100'),
('public',  'pro_gamer',       'https://picsum.photos/id/130/100'),
('public',  'club',            'https://picsum.photos/id/140/100'),
('public',  'beat',            'https://picsum.photos/id/150/100'),
('public',  'party',           'https://picsum.photos/id/160/100'),
('public',  'zen',             'https://picsum.photos/id/170/100'),
('public',  'ray',             'https://picsum.photos/id/180/100'),
('public',  'amy',             'https://picsum.photos/id/190/100'),
('public',  'calm',            'https://picsum.photos/id/210/100'),
('public',  'salute',          'https://picsum.photos/id/220/100'),
('public',  'collector',       'https://picsum.photos/id/230/100'),
('public',  'gallery',         'https://picsum.photos/id/240/100')
on conflict (username) do nothing;

insert into instagram.follows (followee_id, follower_id)
select fe.id, fo.id
from instagram.user fe, instagram.user fo
where fe.username = 'mike' and fo.username = 'alex'
on conflict do nothing;

insert into instagram.follows (followee_id, follower_id)
select fe.id, fo.id
from instagram.user fe, instagram.user fo
where fe.username = 'nature' and fo.username = 'alex'
on conflict do nothing;

insert into instagram.follows (followee_id, follower_id)
select fe.id, fo.id
from instagram.user fe, instagram.user fo
where fe.username = 'city' and fo.username = 'alex'
on conflict do nothing;

insert into instagram.follows (followee_id, follower_id)
select fe.id, fo.id
from instagram.user fe, instagram.user fo
where fe.username = 'alex' and fo.username = 'buddy'
on conflict do nothing;

insert into instagram.follows (followee_id, follower_id)
select fe.id, fo.id
from instagram.user fe, instagram.user fo
where fe.username = 'alex' and fo.username = 'wander'
on conflict do nothing;

insert into instagram.follows (followee_id, follower_id)
select fe.id, fo.id
from instagram.user fe, instagram.user fo
where fe.username = 'critic' and fo.username = 'mia'
on conflict do nothing;

insert into instagram.follows (followee_id, follower_id)
select fe.id, fo.id
from instagram.user fe, instagram.user fo
where fe.username = 'mia' and fo.username = 'joe'
on conflict do nothing;

insert into instagram.follows (followee_id, follower_id)
select fe.id, fo.id
from instagram.user fe, instagram.user fo
where fe.username = 'mia' and fo.username = 'ella'
on conflict do nothing;

insert into instagram.follows (followee_id, follower_id)
select fe.id, fo.id
from instagram.user fe, instagram.user fo
where fe.username = 'mia' and fo.username = 'sweet'
on conflict do nothing;

insert into instagram.follows (followee_id, follower_id)
select fe.id, fo.id
from instagram.user fe, instagram.user fo
where fe.username = 'john' and fo.username = 'emma'
on conflict do nothing;

insert into instagram.follows (followee_id, follower_id)
select fe.id, fo.id
from instagram.user fe, instagram.user fo
where fe.username = 'library' and fo.username = 'emma'
on conflict do nothing;

insert into instagram.follows (followee_id, follower_id)
select fe.id, fo.id
from instagram.user fe, instagram.user fo
where fe.username = 'poet' and fo.username = 'emma'
on conflict do nothing;

insert into instagram.follows (followee_id, follower_id)
select fe.id, fo.id
from instagram.user fe, instagram.user fo
where fe.username = 'lucy' and fo.username = 'max'
on conflict do nothing;

insert into instagram.follows (followee_id, follower_id)
select fe.id, fo.id
from instagram.user fe, instagram.user fo
where fe.username = 'max' and fo.username = 'pro_gamer'
on conflict do nothing;

insert into instagram.follows (followee_id, follower_id)
select fe.id, fo.id
from instagram.user fe, instagram.user fo
where fe.username = 'club' and fo.username = 'sunny'
on conflict do nothing;

insert into instagram.follows (followee_id, follower_id)
select fe.id, fo.id
from instagram.user fe, instagram.user fo
where fe.username = 'beat' and fo.username = 'sunny'
on conflict do nothing;

insert into instagram.follows (followee_id, follower_id)
select fe.id, fo.id
from instagram.user fe, instagram.user fo
where fe.username = 'sunny' and fo.username = 'party'
on conflict do nothing;

insert into instagram.follows (followee_id, follower_id)
select fe.id, fo.id
from instagram.user fe, instagram.user fo
where fe.username = 'zen' and fo.username = 'luna'
on conflict do nothing;

insert into instagram.follows (followee_id, follower_id)
select fe.id, fo.id
from instagram.user fe, instagram.user fo
where fe.username = 'luna' and fo.username = 'ray'
on conflict do nothing;

insert into instagram.follows (followee_id, follower_id)
select fe.id, fo.id
from instagram.user fe, instagram.user fo
where fe.username = 'luna' and fo.username = 'amy'
on conflict do nothing;

insert into instagram.follows (followee_id, follower_id)
select fe.id, fo.id
from instagram.user fe, instagram.user fo
where fe.username = 'luna' and fo.username = 'calm'
on conflict do nothing;

insert into instagram.follows (followee_id, follower_id)
select fe.id, fo.id
from instagram.user fe, instagram.user fo
where fe.username = 'luna' and fo.username = 'salute'
on conflict do nothing;

insert into instagram.follows (followee_id, follower_id)
select fe.id, fo.id
from instagram.user fe, instagram.user fo
where fe.username = 'leo' and fo.username = 'collector'
on conflict do nothing;

insert into instagram.follows (followee_id, follower_id)
select fe.id, fo.id
from instagram.user fe, instagram.user fo
where fe.username = 'leo' and fo.username = 'gallery'
on conflict do nothing;

