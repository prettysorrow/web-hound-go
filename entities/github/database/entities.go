package webhound_github_database

type User struct {
	Id       int64  `json:"id"       db:"id"`
	Username string `json:"username" db:"username"`
	Pfp      []byte `json:"pfp"   db:"pfp"`
}

type Follows struct {
	FolloweeId int64 `json:"followee_id" db:"followee_id"`
	FollowerId int64 `json:"follower_id" db:"follower_id"`
}
