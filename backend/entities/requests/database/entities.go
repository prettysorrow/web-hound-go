package webhound_requests_database

import "time"

type Request struct {
	Id         int64     `db:"id"`
	CreatedAt  time.Time `db:"created_at"`
	CreatedOn  string    `db:"created_on"`
	CreatedBy  int64     `db:"created_by"`
	ResultsIds []int64   `db:"results_ids"`
}

type Result struct {
	Id      int64  `db:"id"`
	Service string `db:"service"`
	UserId  string `db:"user_id"`
}
