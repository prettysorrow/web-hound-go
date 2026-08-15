package webhound_instagram_transport

type InstagramUserShort struct {
	Kind     string `json:"kind"`
	Username string `json:"username"`
	PfpUrl   string `json:"pfp_url"`
}

type InstagramMedia struct {
	Kind string `json:"kind"`
	Url  string `json:"url"`
}

type InstagramPost struct {
	Description string           `json:"description"`
	Media       []InstagramMedia `json:"media"`
}

type InstagramUserPublicInfo struct {
	Kind      string               `json:"kind"`
	Username  string               `json:"username"`
	PfpUrl    string               `json:"pfp_url"`
	Followees []InstagramUserShort `json:"followees"`
	Followers []InstagramUserShort `json:"followers"`
	Posts     *InstagramPost       `json:"posts"`
	Status    string               `json:"status"`
}
