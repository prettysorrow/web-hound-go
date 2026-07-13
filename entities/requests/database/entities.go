package webhound_requests_database

import "time"

type Request struct {
	Id        int64     `json:"id"         db:"id"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
	CreatedOn string    `json:"created_on" db:"created_on"`
	CreatedBy int64     `json:"created_by" db:"created_by"`
	Results   []byte    `json:"results"    db:"results"`
}
