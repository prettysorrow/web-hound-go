package webhound_instagram_transport

type InstagramUserShort struct {
	Kind     string `json:"kind"`
	Username string `json:"username"`
	PfpUrl   string `json:"pfp_url"`
}

type InstagramUserPrivate struct {
	Kind     string `json:"kind"`
	Username string `json:"username"`
	PfpUrl   string `json:"pfp_url"`
}

type InstagramUserPublic struct {
	Kind      string               `json:"kind"`
	Username  string               `json:"username"`
	PfpUrl    string               `json:"pfp_url"`
	Followees []InstagramUserShort `json:"followees"`
	Followers []InstagramUserShort `json:"followers"`
}

type InstagramUserPublicInfo struct {
	Kind      string               `json:"kind"`
	Username  string               `json:"username"`
	PfpUrl    string               `json:"pfp_url"`
	Followees []InstagramUserShort `json:"followees"`
	Followers []InstagramUserShort `json:"followers"`
}
