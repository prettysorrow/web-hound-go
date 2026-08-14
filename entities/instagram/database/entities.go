package webhound_instagram_database

type InstagramUser struct {
	Id       int64  `db:"id" json:"id"`
	Kind     string `db:"kind" json:"kind"`
	Username string `db:"username" json:"username"`
	PfpUrl   string `db:"pfp_url" json:"pfp_url"`
}

type InstagramFollows struct {
	FolloweeId int64 `db:"followee_id"`
	FollowerId int64 `db:"follower_id"`
}

type InstagramPost struct {
	Id          int64  `db:"id"`
	UserId      int64  `db:"user_id"`
	Description string `db:"description"`
}

type InstagramMedia struct {
	Id     int64  `db:"id"`
	PostId int64  `db:"post_id"`
	Kind   string `db:"kind"`
	Url    string `db:"url"`
}
