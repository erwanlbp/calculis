package model

type UserGame struct {
	GameID         string `firestore:"gameId,omitempty"`
	Status         Status `firestore:"status,omitempty"`
	UserID         string `firestore:"userId,omitempty"`
	CurrentLevelID string `firestore:"currentLevelId,omitempty"`
}

type Game struct {
	GameID       string     `firestore:"gameId,omitempty"`
	CreatedAt    string     `firestore:"createdAt,omitempty"`
	Difficulty   Difficulty `firestore:"difficulty,omitempty"`
	CurrentLevel string     `firestore:"currentLevelId,omitempty"`
}

type GameUser struct {
}
