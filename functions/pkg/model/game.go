package model

const (
	StatusSearching = "searching"
	StatusPlaying   = "playing"
)

type UserGame struct {
	Status string `firestore:"status,omitempty"`
	UserId string `firestore:"userId,omitempty"`
}

type Game struct {
	GameId string `firestore:"gameId,omitempty"`
}

type GameUser struct {
	UserPersonalGameId string `firestore:"userPersonalGameId,omitempty"`
}
