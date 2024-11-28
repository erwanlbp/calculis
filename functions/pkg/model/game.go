package model

type UserGame struct {
	GameID string `firestore:"gameId,omitempty"`
	Status Status `firestore:"status,omitempty"`
	UserID string `firestore:"userId,omitempty"`
}

type Game struct {
	GameID     string     `firestore:"gameId,omitempty"`
	Difficulty Difficulty `firestore:"difficulty,omitempty"`
}

type GameUser struct {
}
