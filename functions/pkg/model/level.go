package model

import "time"

type LevelConfig struct {
	Range           int
	SerieSize       int
	PrintedDuration time.Duration
}

// Wrap numbers in a struct, so later we can make it evolve, like adding cards link, image, whatever etc
type LevelNumbers struct {
	Numbers []int
}

type GameLevel struct {
	LevelNumber int          `firestore:"status,omitempty"`
	Status      Status       `firestore:"status,omitempty"`
	Config      LevelConfig  `firestore:"config,omitempty"`
	Numbers     LevelNumbers `firestore:"numbers,omitempty"`
}
