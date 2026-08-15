package webhound_github_transport

type User struct {
	Username  string `json:"username"`
	Verbose   bool   `json:"verbose"`
	PfpUrl    string `json:"pfp_url"`
	Followers []User `json:"followers"`
	Followees []User `json:"followees"`
}
