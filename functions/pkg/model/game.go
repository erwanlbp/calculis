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
	GameId string          `firestore:"gameId,omitempty"`
	Create []GameCreateDto `firestore:"create,omitempty"` // Used as event data in OnGameCreate
}

type GameCreateDto struct {
	UserId             string `firestore:"userId,omitempty" json:"userId,omitempty"`
	UserPersonalGameId string `firestore:"userPersonalGameId,omitempty" json:"userPersonalGameId,omitempty"`
}

type GameUser struct {
	UserPersonalGameId string `firestore:"userPersonalGameId,omitempty"`
}
