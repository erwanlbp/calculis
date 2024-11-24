package model

type UserGame struct {
	Status Status `firestore:"status,omitempty"`
	UserId string `firestore:"userId,omitempty"`
}

type Game struct {
	GameId     string     `firestore:"gameId,omitempty"`
	Difficulty Difficulty `firestore:"difficulty,omitempty"`
}

type GameUser struct {
	UserPersonalGameId string `firestore:"userPersonalGameId,omitempty"`
}
