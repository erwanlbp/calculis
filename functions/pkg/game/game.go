package game

import (
	"context"
	"fmt"
	"log/slog"

	firestorego "cloud.google.com/go/firestore"

	"github.com/erwanlbp/calculis/pkg/firestore"
	"github.com/erwanlbp/calculis/pkg/level"
	"github.com/erwanlbp/calculis/pkg/log"
	"github.com/erwanlbp/calculis/pkg/model"
)

func TryCreatingGame(ctx context.Context, userId, userGameId string) {
	it := firestore.Client.CollectionGroup("usergames").
		Where("status", "==", model.StatusSearching).
		Where("userId", "!=", userId).
		Limit(1).
		Select("userId").
		Documents(ctx)

	foundPlayerDocsnapshots, err := it.GetAll()
	if err != nil {
		slog.Error("failed to search for opponent", log.Err(err))
		return
	}
	if len(foundPlayerDocsnapshots) == 0 {
		// No one is looking for a game, stop there, user game is in search mode
		slog.Info("No one else is looking for a game", slog.String("userId", userId))
		return
	}
	foundPlayerDocsnapshot := foundPlayerDocsnapshots[0]

	// Opponent has been found, trigger the game creation

	var foundPlayerDoc model.UserGame
	if err := foundPlayerDocsnapshot.DataTo(&foundPlayerDoc); err != nil {
		slog.Error("failed to unmarshal user game", log.Err(err), slog.Any("doc", foundPlayerDocsnapshot.Data()))
		return
	}
	slog.Info("Found user to match against", slog.String("userId", userId), slog.String("opponentId", foundPlayerDoc.UserId))

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
			slog.Error("failed to create game", log.Err(err), slog.String("userId", userId), slog.String("opponentId", foundPlayerDoc.UserId))
			return err
		}
		slog.Info("Created game " + gameDoc.ID)

		for _, p := range players {
			gameUserDoc := firestore.Client.Doc(fmt.Sprintf("games/%s/gameusers/%s", gameDoc.ID, p.UserId))
			if err := tx.Set(gameUserDoc, model.GameUser{UserPersonalGameId: p.UserGameId}); err != nil {
				slog.Error("failed to create gameuser doc", log.Err(err), slog.String("gameId", gameDoc.ID), slog.String("userId", p.UserId))
				return err
			}
			slog.Info("Created game user", slog.String("gameId", gameDoc.ID), slog.String("userId", p.UserId), slog.String("usergame", p.UserGameId))

			userGameDoc := firestore.Client.Doc(fmt.Sprintf("users/%s/usergames/%s", p.UserId, p.UserGameId))
			if err := tx.Update(userGameDoc, []firestorego.Update{
				{Path: "status", Value: model.StatusPlaying},
				{Path: "gameId", Value: gameDoc.ID},
			}); err != nil {
				slog.Error("failed to update usergame doc", log.Err(err), slog.String("gameId", gameDoc.ID), slog.String("userId", p.UserId), slog.String("usergame", p.UserGameId))
				return err
			}
			slog.Info("Updated user game", slog.String("gameId", gameDoc.ID), slog.String("userId", p.UserId), slog.String("usergame", p.UserGameId))
		}

		// Create first level
		if err := level.GenerateLevel(ctx, tx, level.GenerateLevelDto{
			LevelNumber: 1,
			GameId:      gameDoc.ID,
			Config:      level.DefaultConfig, // TODO Change that to have different kind of games
		}); err != nil {
			return fmt.Errorf("failed to create game first level: %w", err)
		}

		return nil
	}); err != nil {
		slog.Error("game creation tx failed", log.Err(err))
	}
}
