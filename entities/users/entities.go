package webhound_entities

import "time"

type User struct {
	Id          int64  `json:"id" db:"id"`
	DisplayName string `json:"display_name" db:"display_name"`
	UsedService string `json:"used_service" db:"used_service"`
}

type Request struct {
	Id        int64     `json:"id" db:"id"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
	CreatedOn string    `json:"created_on" db:"created_on"`
	CreatedBy int       `json:"created_by" db:"created_by"`
}
