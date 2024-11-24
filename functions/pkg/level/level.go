package level

import (
	"context"
	"fmt"

	firestorego "cloud.google.com/go/firestore"

	"github.com/erwanlbp/calculis/pkg/firestore"
	"github.com/erwanlbp/calculis/pkg/model"
)

type GenerateLevelDto struct {
	GameId      string
	LevelNumber int
	Config      model.LevelConfig
}

func GenerateLevel(ctx context.Context, tx *firestorego.Transaction, dto GenerateLevelDto) error {
	data := model.GameLevel{
		LevelNumber: dto.LevelNumber,
		Status:      model.StatusPlaying,
		Config:      GenerateLevelConfig(dto.LevelNumber, model.MediumDifficulty, dto.Config),
	}
	data.Numbers = GenerateLevelNumbers(dto.LevelNumber, data.Config)

	levelRef := firestore.Client.Doc(fmt.Sprintf("games/%s/gamelevels/%d", dto.GameId, dto.LevelNumber))
	if err := tx.Set(levelRef, data); err != nil {
		return fmt.Errorf("failed to add level doc: %w", err)
	}

	return nil
}
