package model

import "time"

type LevelConfig struct {
	Range           int           `json:"range"`
	SerieSize       int           `json:"serieSize"`
	PrintedDuration time.Duration `json:"printedDuration"`
}

// Wrap numbers in a struct, so later we can make it evolve, like adding cards link, image, whatever etc
type LevelNumbers struct {
	Numbers []int `json:"numbers"`
}

type UserAnswer struct {
	Correct bool `json:"correct,omitempty"`
}

type GameLevel struct {
	LevelNumber int          `firestore:"status,omitempty"`
	Status      Status       `firestore:"status,omitempty"`
	Config      LevelConfig  `firestore:"config,omitempty"`
	Numbers     LevelNumbers `firestore:"numbers,omitempty"`

	UsersAnswer map[string]UserAnswer `firestore:"usersAnswer,omitempty"`
}

func (l GameLevel) CorrectAnswer() int {
	var res int
	for _, n := range l.Numbers.Numbers {
		res += n
	}
	return res
}
