package webhound_telegram_database

type User struct {
	Id        int64   `json:"id"          db:"id"`
	Username  string  `json:"username"    db:"username"`
	FirstName string  `json:"first_name"  db:"first_name"`
	LastName  *string `json:"last_name"   db:"last_name"`
	Phone     *string `json:"phone"       db:"phone"`
	Bio       *string `json:"bio"         db:"bio"`
	ChannelId *int64  `json:"channel_id"  db:"channel_id"`
}

type Channel struct {
	Id   int64   `json:"id"          db:"id"`
	Url  string  `json:"url"         db:"url"`
	Name string  `json:"name"        db:"name"`
	Bio  *string `json:"bio"         db:"bio"`
}

type Photo struct {
	Id        int64  `json:"id"         db:"id"`
	ImageData []byte `json:"image_data" db:"image_data"`
}

type ProfilePhoto struct {
	PhotoId int64 `json:"photo_id" db:"photo_id"`
	UserId  int64 `json:"user_id"  db:"user_id"`
}

type ChannelPhoto struct {
	PhotoId   int64 `json:"photo_id"    db:"photo_id"`
	ChannelId int64 `json:"channel_id"  db:"channel_id"`
}

type ChannelPostPhoto struct {
	PhotoId   int64 `json:"photo_id"    db:"photo_id"`
	ChannelId int64 `json:"channel_id"  db:"channel_id"`
}
