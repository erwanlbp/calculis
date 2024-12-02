package dto

import (
	"time"

	"github.com/erwanlbp/calculis/pkg/model"
)

type LevelConfig struct {
	Range           int           `json:"range"`
	SerieSize       int           `json:"serieSize"`
	PrintedDuration time.Duration `json:"printedDuration"`
}

type LevelNumbers struct {
	Numbers []int `json:"numbers,omitempty"`
}

type GetLevelContentResponse struct {
	Status            model.Status    `json:"status,omitempty"`
	Config            LevelConfig     `json:"config,omitempty"`
	Numbers           LevelNumbers    `json:"numbers,omitempty"`
	UsersFetchedLevel map[string]bool `json:"usersAnswered,omitempty"`
}

func MapGetLevelContentResponse(level model.GameLevel) GetLevelContentResponse {
	return GetLevelContentResponse{
		Status: level.Status,
		Config: LevelConfig{
			Range:           level.Config.Range,
			SerieSize:       level.Config.SerieSize,
			PrintedDuration: level.Config.PrintedDuration,
		},
		Numbers: LevelNumbers{
			Numbers: level.Numbers.Numbers,
		},
		UsersFetchedLevel: level.UsersFetchedLevel,
	}
}
