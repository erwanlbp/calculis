package game

import (
	"context"
	"fmt"
	"log/slog"

	firestorego "cloud.google.com/go/firestore"

	"github.com/erwanlbp/calculis/pkg/firestore"
	"github.com/erwanlbp/calculis/pkg/log"
	"github.com/erwanlbp/calculis/pkg/model"
)

func TryCreatingGame(ctx context.Context, logger *slog.Logger, userId, userGameId string) {
	it := firestore.Client.CollectionGroup("usergames").
		Where("status", "==", model.StatusSearching).
		Where("userId", "!=", userId).
		Limit(1).
		Select("userId").
		Documents(ctx)

	foundPlayerDocsnapshots, err := it.GetAll()
	if err != nil {
		logger.Error("failed to search for opponent", log.Err(err))
		return
	}
	if len(foundPlayerDocsnapshots) == 0 {
		// No one is looking for a game, stop there, user game is in search mode
		logger.Info("No one else is looking for a game")
		return
	}
	foundPlayerDocsnapshot := foundPlayerDocsnapshots[0]

	// Opponent has been found, trigger the game creation

	var foundPlayerDoc model.UserGame
	if err := foundPlayerDocsnapshot.DataTo(&foundPlayerDoc); err != nil {
		logger.Error("failed to unmarshal user game", log.Err(err), slog.Any("doc", foundPlayerDocsnapshot.Data()))
		return
	}

	logger = logger.With(slog.String("opponentId", foundPlayerDoc.UserId))

	logger.Info("Found user to match against")

	players := []struct {
		UserId     string
		UserGameId string
	}{
		{UserId: userId, UserGameId: userGameId},
		{UserId: foundPlayerDoc.UserId, UserGameId: foundPlayerDocsnapshot.Ref.ID},
	}

	if err := firestore.Client.RunTransaction(ctx, func(ctx context.Context, tx *firestorego.Transaction) error {
		gameDoc := firestore.Client.Collection("games").NewDoc()
		if err := tx.Set(gameDoc, model.Game{GameId: gameDoc.ID}); err != nil {
			logger.Error("failed to create game", log.Err(err))
			return err
		}
		logger.Info("Created game")

		for _, player := range players {
			logger := logger.With(log.PlayerID(player.UserId), log.UserGameID(player.UserGameId))
			gameUserDoc := firestore.Client.Doc(fmt.Sprintf("games/%s/gameusers/%s", gameDoc.ID, player.UserId))
			if err := tx.Set(gameUserDoc, model.GameUser{}); err != nil {
				logger.Error("failed to create gameuser doc", log.Err(err))
				return err
			}
			logger.Info("Created game user")

			newUserGameDoc := firestore.Client.Doc(fmt.Sprintf("users/%s/usergames/%s", player.UserId, gameDoc.ID))
			if err := tx.Update(newUserGameDoc, []firestorego.Update{
				{Path: "status", Value: model.StatusPlaying},
			}); err != nil {
				logger.Error("failed to create usergame doc", log.Err(err))
				return err
			}
			logger.Info("Created user game")

			if err := tx.Delete(firestore.Client.Doc(fmt.Sprintf("users/%s/usergames/%s", player.UserId, player.UserGameId))); err != nil {
				logger.Error("failed to delete usergame searching doc", log.Err(err))
				return err
			}
			logger.Info("Deleted user game searching doc")
		}

		// Create first level
		if err := GenerateLevel(ctx, tx, GenerateLevelDto{
			LevelNumber: 1,
			GameId:      gameDoc.ID,
			Config:      DefaultConfig, // TODO Change that to have different kind of games
		}); err != nil {
			return fmt.Errorf("failed to create game first level: %w", err)
		}

		logger.Info("Generated game level 1")

		return nil
	}); err != nil {
		slog.Error("game creation tx failed", log.Err(err))
	}
}

func SetGameStatus(ctx context.Context, tx *firestorego.Transaction, gameID string, status model.Status) error {
	ref := firestore.Client.Doc(fmt.Sprintf("games/%s", gameID))
	return tx.Update(ref, []firestorego.Update{{Path: "status", Value: status}})
}

func SetUserGameStatus(ctx context.Context, tx *firestorego.Transaction, userID, gameID string, status model.Status) error {
	ref := firestore.Client.Doc(fmt.Sprintf("users/%s/usergames/%s", userID, gameID))
	return tx.Update(ref, []firestorego.Update{{Path: "status", Value: status}})
}
