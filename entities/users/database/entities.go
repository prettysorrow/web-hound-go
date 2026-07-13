package webhound_users_database

type User struct {
	Id          int64  `json:"id"           db:"id"`
	DisplayName string `json:"display_name" db:"display_name"`
	UsedService string `json:"used_service" db:"used_service"`
	ServiceId   string `json:"service_id"   db:"service_id"`
}
