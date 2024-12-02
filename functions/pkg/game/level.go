package game

import (
	"context"
	"errors"
	"fmt"
	"log/slog"

	firestorego "cloud.google.com/go/firestore"

	"github.com/erwanlbp/calculis/pkg/firestore"
	"github.com/erwanlbp/calculis/pkg/log"
	"github.com/erwanlbp/calculis/pkg/model"
	"github.com/erwanlbp/calculis/pkg/notification"
)

type GenerateLevelDto struct {
	GameId       string
	LevelNumber  int
	PlayersCount int
	Config       model.LevelConfig
}

func GenerateLevel(ctx context.Context, logger *slog.Logger, tx *firestorego.Transaction, dto GenerateLevelDto) (string, error) {
	data := model.GameLevel{
		LevelNumber:  dto.LevelNumber,
		Status:       model.StatusPlaying,
		PlayersCount: dto.PlayersCount,
		Config:       GenerateLevelConfig(dto.LevelNumber, model.MediumDifficulty, dto.Config),
	}
	data.Numbers = GenerateLevelNumbers(dto.LevelNumber, data.Config)

	levelRef := firestore.Client.Doc(fmt.Sprintf("games/%s/gamelevels/%d", dto.GameId, dto.LevelNumber))
	if err := tx.Set(levelRef, data); err != nil {
		return "", fmt.Errorf("failed to add level doc: %w", err)
	}
	logger.Info("Created game level", log.LevelID(fmt.Sprint(dto.LevelNumber)))

	gameRef := firestore.Client.Doc(fmt.Sprintf("games/%s", dto.GameId))
	if err := tx.Update(gameRef, []firestorego.Update{{Path: "currentLevelId", Value: fmt.Sprint(dto.LevelNumber)}}); err != nil {
		return "", fmt.Errorf("failed to update game current level: %w", err)
	}
	logger.Info("Updated game current level")

	return levelRef.ID, nil
}

func FinishLevel(ctx context.Context, logger *slog.Logger, gameID, levelID string, lastUserID string) {
	// Logger contains gameID and levelID already
	logger = logger.With(log.Caller("FinishLevel"))

	level, levelRef, err := GetGameLevel(ctx, logger, gameID, levelID)
	if errors.Is(err, ErrNotFound) {
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

	status, correctUsers := level.StatusAfterFinish()
	logger = logger.With(log.EndLevelStatus(status))

	if err := firestore.Client.RunTransaction(ctx, func(ctx context.Context, tx *firestorego.Transaction) error {
		if err := tx.Set(levelRef, level); err != nil {
			return fmt.Errorf("failed to update level doc: %w", err)
		}
		logger.Info("Updated game level", log.Status(level.Status))

		var nextLevelID string
		if status == model.LevelStatusAllUsersCorrect || status == model.LevelStatusMultipleUsersCorrect {
			lid, err := GenerateLevel(ctx, logger, tx, GenerateLevelDto{
				GameId:       gameID,
				LevelNumber:  level.LevelNumber + 1,
				PlayersCount: len(correctUsers[true]),
				Config:       level.Config,
			})
			if err != nil {
				return fmt.Errorf("failed to create game level(%d): %w", level.LevelNumber+1, err)
			}
			nextLevelID = lid
		}

		switch status {
		case model.LevelStatusNoUserCorrect:
			// If all users lost, that's a tie (for now)
			for _, userId := range correctUsers[false] {
				if err := UpdateUserGame(ctx, tx, userId, gameID, model.StatusTie, ""); err != nil {
					return fmt.Errorf("failed to update user(%s) game status(%s): %w", userId, model.StatusTie, err)
				}
			}
			logger.Info("Updated failed usergames", log.Len(len(correctUsers[false])), log.Status(model.StatusTie))

			if err := SetGameStatus(ctx, tx, gameID, model.StatusPlayed); err != nil {
				return fmt.Errorf("failed to update game status(%s): %w", model.StatusWon, err)
			}
			logger.Info("Updated game status", log.Status(model.StatusPlayed))
		case model.LevelStatusOnlyOneCorrect:
			// For users that lost, mark their game as lost
			for _, userId := range correctUsers[false] {
				if err := UpdateUserGame(ctx, tx, userId, gameID, model.StatusLost, ""); err != nil {
					return fmt.Errorf("failed to update user(%s) game status(%s): %w", userId, model.StatusLost, err)
				}
			}
			logger.Info("Updated failed usergames", log.Len(len(correctUsers[false])), log.Status(model.StatusLost))
			// For the user that won, mark his game as won
			for _, userId := range correctUsers[true] {
				if err := UpdateUserGame(ctx, tx, userId, gameID, model.StatusWon, ""); err != nil {
					return fmt.Errorf("failed to update user(%s) game status(%s): %w", userId, model.StatusWon, err)
				}
			}
			logger.Info("Updated correct usergames", log.Len(len(correctUsers[true])), log.Status(model.StatusWon))
			if err := SetGameStatus(ctx, tx, gameID, model.StatusPlayed); err != nil {
				return fmt.Errorf("failed to update game status(%s): %w", model.StatusWon, err)
			}
			logger.Info("Updated game status", log.Status(model.StatusPlayed))
		case model.LevelStatusMultipleUsersCorrect:
			// For users that lost, mark their game as lost
			for _, userId := range correctUsers[false] {
				if err := UpdateUserGame(ctx, tx, userId, gameID, model.StatusLost, ""); err != nil {
					return fmt.Errorf("failed to update user(%s) game status(%s): %w", userId, model.StatusLost, err)
				}
			}
			logger.Info("Updated failed usergames", log.Len(len(correctUsers[false])), log.Status(model.StatusLost))
			fallthrough
		case model.LevelStatusAllUsersCorrect:
			// Next level is already generated
			// Update current level for usergames
			for _, userId := range correctUsers[true] {
				if err := UpdateUserGame(ctx, tx, userId, gameID, model.StatusPlaying, nextLevelID); err != nil {
					return fmt.Errorf("failed to update user(%s) game level(%s): %w", userId, levelID, err)
				}
			}
			logger.Info("Updated correct usergames", log.Len(len(correctUsers[true])), slog.String("nextLevelId", nextLevelID))
		default:
			logger.Error("unplanned level status after finish, can't continue")
			return fmt.Errorf("unplanned status: %s", status)
		}

		return nil
	}); err != nil {
		logger.Error("failed to finish game level", log.Err(err))
		return
	}

	notification.SendLevelFinishedNotification(ctx, logger, gameID, lastUserID, status, correctUsers)
}
