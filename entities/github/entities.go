package webhound_entities_github

type Pfp struct {
	Id        int    `json:"id" db:"id"`
	ImageData []byte `json:"image_data" db:"image_data"`
}

type User struct {
	Id       int    `json:"id" db:"id"`
	Username string `json:"username" db:"username"`
	PfpId    int    `json:"pfp_id" db:"pfp_id"`
}

type Follows struct {
	FolloweeId int `json:"followee_id" db:"followee_id"`
	FollowerId int `json:"follower_id" db:"follower_id"`
}

type Request struct {
	Id     int `json:"id" db:"id"`
	CoreId int `json:"core_id" db:"core_id"`
	UserId int `json:"user_id" db:"user_id"`
}
