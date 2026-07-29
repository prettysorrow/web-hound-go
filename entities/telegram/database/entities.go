package webhound_telegram_database

type User struct {
	Id        int64   `db:"id"`
	Username  string  `db:"username"`
	FirstName string  `db:"first_name"`
	LastName  *string `db:"last_name"`
	Phone     *string `db:"phone"`
	Bio       *string `db:"bio"`
	ChannelId *int64  `db:"channel_id"`
}

type Channel struct {
	Id   int64   `db:"id"`
	Url  string  `db:"url"`
	Name string  `db:"name"`
	Bio  *string `db:"bio"`
}

type Photo struct {
	Id        int64  `db:"id"`
	ImageData []byte `db:"image_data"`
}

type ProfilePhoto struct {
	PhotoId int64 `db:"photo_id"`
	UserId  int64 `db:"user_id"`
}

type ChannelPhoto struct {
	PhotoId   int64 `db:"photo_id"`
	ChannelId int64 `db:"channel_id"`
}

type ChannelPostPhoto struct {
	PhotoId   int64 `db:"photo_id"`
	ChannelId int64 `db:"channel_id"`
}
