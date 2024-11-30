package model

import "time"

type LevelConfig struct {
	Range           int           `firestore:"range"`
	SerieSize       int           `firestore:"serieSize"`
	PrintedDuration time.Duration `firestore:"printedDuration"`
}

// Wrap numbers in a struct, so later we can make it evolve, like adding cards link, image, whatever etc
type LevelNumbers struct {
	Numbers []int `firestore:"numbers,omitempty"`
}

type UserAnswer struct {
	Correct bool `firestore:"correct,omitempty"`
}

type GameLevel struct {
	LevelNumber  int          `firestore:"levelNumber,omitempty"`
	PlayersCount int          `firestore:"playersCount,omitempty"`
	Status       Status       `firestore:"status,omitempty"`
	Config       LevelConfig  `firestore:"config,omitempty"`
	Numbers      LevelNumbers `firestore:"numbers,omitempty"`

	UsersAnswer map[string]UserAnswer `firestore:"usersAnswer,omitempty"`
}

func (l GameLevel) CorrectAnswer() int {
	var res int
	for _, n := range l.Numbers.Numbers {
		res += n
	}
	return res
}

type LevelStatusAfterFinish string

const (
	StatusError                     LevelStatusAfterFinish = "error"
	LevelStatusAllUsersCorrect      LevelStatusAfterFinish = "all_users_correct"
	LevelStatusOnlyOneCorrect       LevelStatusAfterFinish = "only_one_user_correct"
	LevelStatusMultipleUsersCorrect LevelStatusAfterFinish = "multiple_users_correct"
	LevelStatusNoUserCorrect        LevelStatusAfterFinish = "no_user_correct"
)

func (l GameLevel) StatusAfterFinish() (LevelStatusAfterFinish, map[bool][]string) {
	if len(l.UsersAnswer) == 0 {
		return StatusError, nil
	}
	var usersCorrect = make(map[bool][]string)
	for userID, userAnswer := range l.UsersAnswer {
		usersCorrect[userAnswer.Correct] = append(usersCorrect[userAnswer.Correct], userID)
	}
	if len(usersCorrect[true]) == 0 {
		return LevelStatusNoUserCorrect, usersCorrect
	}
	if len(usersCorrect[false]) == 0 {
		return LevelStatusAllUsersCorrect, usersCorrect
	}

	if len(usersCorrect[true]) == 1 {
		return LevelStatusOnlyOneCorrect, usersCorrect
	}

	return LevelStatusMultipleUsersCorrect, usersCorrect
}
