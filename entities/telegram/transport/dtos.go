package webhound_telegram_transport

type User struct {
	Username  string   `json:"username"`
	FirstName string   `json:"first_name"`
	LastName  *string  `json:"last_name"`
	Phone     *string  `json:"phone"`
	Bio       *string  `json:"bio"`
	Channel   *Channel `json:"channel"`
	Photos    []Photo  `json:"photos"`
}

type Channel struct {
	Url         string  `json:"url"`
	Name        string  `json:"name"`
	Bio         *string `json:"bio"`
	Photos      []Photo `json:"photos"`
	PostsPhotos []Photo `json:"posts_photos"`
}

type Photo struct {
	ImageData []byte `json:"image_data"`
}
