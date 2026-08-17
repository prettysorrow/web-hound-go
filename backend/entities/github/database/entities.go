package webhound_github_database

type User struct {
	Id       int64  `db:"id"`
	Verbose  bool   `db:"verbose"`
	Username string `db:"username"`
	PfpUrl   string `db:"pfp_url"`
}

type Follows struct {
	FolloweeId int64 `db:"followee_id"`
	FollowerId int64 `db:"follower_id"`
}
