package model

const (
	StatusSearching = "searching"
)

type UserGame struct {
	Status string `json:"status,omitempty"`
}
