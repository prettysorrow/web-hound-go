package webhound_users_transport

type GetUserInput struct {
	Id int64 `json:"id"`
}

type PostUserInput struct {
	DisplayName string `json:"display_name"`
	UsedService string `json:"used_service"`
}

type GetUsersInput struct {
}

type GetRequestInput struct {
	Id int64 `json:"id"`
}

type GetRequestsByUserIdInput struct {
	UserId string `json:"user_id"`
}
