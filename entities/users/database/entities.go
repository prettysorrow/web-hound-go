package webhound_users_database

type User struct {
	Id          int64  `db:"id"`
	DisplayName string `db:"display_name"`
	UsedService string `db:"used_service"`
	ServiceId   string `db:"service_id"`
}
