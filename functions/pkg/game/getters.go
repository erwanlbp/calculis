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

var ErrNotFound = errors.New("not found")

func GetGameLevel(ctx context.Context, logger *slog.Logger, gameID, levelID string) (*model.GameLevel, *firestorego.DocumentRef, error) {
	levelRef := firestore.Client.Doc(fmt.Sprintf("games/%s/gamelevels/%s", gameID, levelID))
	levelDoc, err := levelRef.Get(ctx)
	if status.Code(err) == codes.NotFound {
		return nil, nil, ErrNotFound
	}
	if err != nil {
		logger.Error("failed to find level doc", log.Err(err))
		return nil, nil, fmt.Errorf("failed to find level")
	}
	var level model.GameLevel
	if err := levelDoc.DataTo(&level); err != nil {
		logger.Error("failed to unmarshal level doc", log.Err(err), slog.Any("data", levelDoc.Data()))
		return nil, nil, fmt.Errorf("failed to unmarshal level")
	}
	if level.UsersAnswer == nil {
		level.UsersAnswer = make(map[string]model.UserAnswer)
	}
	if level.UsersFetchedLevel == nil {
		level.UsersFetchedLevel = make(map[string]bool)
	}
	return &level, levelRef, nil
}
