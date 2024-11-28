package game

import (
	"context"
	"errors"
	"fmt"
	"log/slog"

	firestorego "cloud.google.com/go/firestore"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"

	"github.com/erwanlbp/calculis/pkg/firestore"
	"github.com/erwanlbp/calculis/pkg/log"
	"github.com/erwanlbp/calculis/pkg/model"
)

var ErrGameLevelNotFound = errors.New("game level not found")

func GetGameLevel(ctx context.Context, logger *slog.Logger, gameID, levelID string) (*model.GameLevel, *firestorego.DocumentRef, error) {
	levelRef := firestore.Client.Doc(fmt.Sprintf("games/%s/gamelevels/%s", gameID, levelID))
	levelDoc, err := levelRef.Get(ctx)
	if status.Code(err) == codes.NotFound {
		return nil, nil, ErrGameLevelNotFound
	}
	if err != nil {
		logger.Error("failed to find level doc", log.Err(err))
		return nil, nil, fmt.Errorf("failed to find level")
	}
	var level model.GameLevel
	if err := levelDoc.DataTo(&level); err != nil {
		logger.Error("failed to unmarshal level doc", log.Err(err), slog.Any("data", levelDoc.Data()))
		return nil, nil, fmt.Errorf("failed to find level")
	}
	if level.UsersAnswer == nil {
		level.UsersAnswer = make(map[string]model.UserAnswer)
	}
	return &level, levelRef, nil
}

type GenerateLevelDto struct {
	GameId       string
	LevelNumber  int
	PlayersCount int
	Config       model.LevelConfig
}

func GenerateLevel(ctx context.Context, tx *firestorego.Transaction, dto GenerateLevelDto) error {
	data := model.GameLevel{
		LevelNumber:  dto.LevelNumber,
		Status:       model.StatusPlaying,
		PlayersCount: dto.PlayersCount,
		Config:       GenerateLevelConfig(dto.LevelNumber, model.MediumDifficulty, dto.Config),
	}
	data.Numbers = GenerateLevelNumbers(dto.LevelNumber, data.Config)

	levelRef := firestore.Client.Doc(fmt.Sprintf("games/%s/gamelevels/%d", dto.GameId, dto.LevelNumber))
	if err := tx.Set(levelRef, data); err != nil {
		return fmt.Errorf("failed to add level doc: %w", err)
	}

	return nil
}

func FinishLevel(ctx context.Context, logger *slog.Logger, gameID, levelID string) {
	// Logger contains gameID and levelID already
	logger = logger.With(log.Caller("FinishLevel"))

	level, levelRef, err := GetGameLevel(ctx, logger, gameID, levelID)
	if errors.Is(err, ErrGameLevelNotFound) {
		logger.Error("cannot find game level", log.Err(err))
		return
	}
	if err != nil {
		logger.Error("failed to find game level", log.Err(err))
		return
	}
	// Security
	if len(level.UsersAnswer) < level.PlayersCount {
		return
	}
	level.Status = model.StatusPlayed

	if err := firestore.Client.RunTransaction(ctx, func(ctx context.Context, tx *firestorego.Transaction) error {
		if err := tx.Set(levelRef, level); err != nil {
			return fmt.Errorf("failed to update level doc: %w", err)
		}

		status, correctUsers := level.StatusAfterFinish()

		switch status {
		case model.LevelStatusNoUserCorrect:
			// If all users lost, that's a tie (for now)
			for _, userId := range correctUsers[false] {
				if err := SetUserGameStatus(ctx, tx, userId, gameID, model.StatusTie); err != nil {
					return fmt.Errorf("failed to update user(%s) game status(%s): %w", userId, model.StatusTie, err)
				}
			}
			if err := SetGameStatus(ctx, tx, gameID, model.StatusPlayed); err != nil {
				return fmt.Errorf("failed to update game status(%s): %w", model.StatusWon, err)
			}
		case model.LevelStatusOnlyOneCorrect:
			// For users that lost, mark their game as lost
			for _, userId := range correctUsers[false] {
				if err := SetUserGameStatus(ctx, tx, userId, gameID, model.StatusLost); err != nil {
					return fmt.Errorf("failed to update user(%s) game status(%s): %w", userId, model.StatusLost, err)
				}
			}
			// For the user that won, mark his game as won
			for _, userId := range correctUsers[true] {
				if err := SetUserGameStatus(ctx, tx, userId, gameID, model.StatusWon); err != nil {
					return fmt.Errorf("failed to update user(%s) game status(%s): %w", userId, model.StatusWon, err)
				}
			}
			if err := SetGameStatus(ctx, tx, gameID, model.StatusPlayed); err != nil {
				return fmt.Errorf("failed to update game status(%s): %w", model.StatusWon, err)
			}
		case model.LevelStatusMultipleUsersCorrect:
			// For users that lost, mark their game as lost
			for _, userId := range correctUsers[false] {
				if err := SetUserGameStatus(ctx, tx, userId, gameID, model.StatusLost); err != nil {
					return fmt.Errorf("failed to update user(%s) game status(%s): %w", userId, model.StatusLost, err)
				}
			}
			fallthrough
		case model.LevelStatusAllUsersCorrect:
			if err := GenerateLevel(ctx, tx, GenerateLevelDto{
				GameId:       gameID,
				LevelNumber:  level.LevelNumber + 1,
				PlayersCount: len(correctUsers[true]),
				Config:       level.Config,
			}); err != nil {
				return fmt.Errorf("failed to create game level(%d): %w", level.LevelNumber+1, err)
			}
		default:
			logger.Error("unplanned level status after finish, can't continue", log.EndLevelStatus(status))
			return fmt.Errorf("unplanned status: %s", status)
		}

		return nil
	}); err != nil {
		logger.Error("failed to finish game level", log.Err(err))
		return
	}
}
