package game

import (
	"math"
	"math/rand/v2"
	"time"

	"github.com/erwanlbp/calculis/pkg/model"
)

var DefaultConfig model.LevelConfig = model.LevelConfig{
	Range:           5,
	SerieSize:       3,
	PrintedDuration: 1 * time.Second,
}

func Range(level int, config model.LevelConfig) int {
	return int(math.Floor(float64(level)/5)) + config.Range
}

func SerieSize(level int, config model.LevelConfig) int {
	return int(math.Floor(float64(level)/4)) + config.SerieSize
}

func PrintedDuration(level int, difficulty model.Difficulty, config model.LevelConfig) time.Duration {
	switch difficulty {
	case model.EasyDifficulty:
		return 2 * time.Second
	case model.MediumDifficulty:
		return 1300 * time.Millisecond
	case model.HardDifficulty:
		return 800 * time.Millisecond
	default:
		return DefaultConfig.PrintedDuration
	}
}

func GenerateLevelConfig(level int, difficulty model.Difficulty, baseConfig model.LevelConfig) model.LevelConfig {
	return model.LevelConfig{
		Range:           Range(level, baseConfig),
		SerieSize:       SerieSize(level, baseConfig),
		PrintedDuration: PrintedDuration(level, difficulty, baseConfig),
	}
}

func GenerateLevelNumbers(level int, config model.LevelConfig) (res model.LevelNumbers) {
	res.Numbers = []int{0}

	for range config.SerieSize {
		res.Numbers = append(res.Numbers, GenerateNumber(config.Range))
	}

	res.Numbers = append(res.Numbers, 0)

	return res
}

var Rander func(int) int = rand.IntN

func GenerateNumber(configRange int) int {
	n := GenerateNumberWithRand(configRange, Rander)
	for n == 0 {
		n = GenerateNumberWithRand(configRange, Rander)
	}
	return n
}

func GenerateNumberWithRand(configRange int, rander func(int) int) int {
	return rander(2*configRange+1) - configRange
}
