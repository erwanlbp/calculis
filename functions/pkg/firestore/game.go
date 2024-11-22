package firestore

import (
	"context"
	"fmt"
	"log/slog"

	"github.com/erwanlbp/calculis/pkg/model"
)

type CreateGameDto struct {
	UserId     string
	UserGameId string
}

// This will add a doc in /games, that will trigger game creation
func CreateGame(ctx context.Context, userGames []CreateGameDto) error {
	var create []model.GameCreateDto
	for _, userGame := range userGames {
		create = append(create, model.GameCreateDto{
			UserId:             userGame.UserId,
			UserPersonalGameId: userGame.UserGameId,
		})
	}

	gameDoc := Client.Collection("games").NewDoc()
	if _, err := gameDoc.Set(ctx, model.Game{GameId: gameDoc.ID, Create: create}); err != nil {
		return fmt.Errorf("failed to create game: %w", err)
	}
	slog.Info("Created game " + gameDoc.ID)

	return nil
}
