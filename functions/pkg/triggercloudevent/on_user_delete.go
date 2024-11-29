package triggercloudevent

import (
	"context"
	"errors"
	"fmt"
	"log/slog"
	"strings"

	"github.com/cloudevents/sdk-go/v2/event"
	"github.com/googleapis/google-cloudevents-go/cloud/firestoredata"
	"google.golang.org/protobuf/proto"

	firebase "github.com/erwanlbp/calculis/pkg/firestore"
	"github.com/erwanlbp/calculis/pkg/log"
)

func OnUserDeleteEntryPoint(ctx context.Context, protoEvent event.Event) error {
	var data firestoredata.DocumentEventData
	if err := proto.Unmarshal(protoEvent.Data(), &data); err != nil {
		return fmt.Errorf("proto.Unmarshal: %w", err)
	}

	refParts := strings.Split(data.GetOldValue().Name, "/")
	userId := refParts[len(refParts)-1]

	return OnUserDelete(ctx, userId)
}

func OnUserDelete(ctx context.Context, userID string) error {
	var resErr error

	if err := DeleteUserScores(ctx, userID); err != nil {
		resErr = errors.Join(resErr, fmt.Errorf("failed to delete user scores: %w", err))
	}
	if err := DeleteUserGames(ctx, userID); err != nil {
		resErr = errors.Join(resErr, fmt.Errorf("failed to delete user games: %w", err))
	}

	return resErr
}

func DeleteUserScores(ctx context.Context, userID string) error {
	slog.Info("Deleting user scores ...", log.UserID(userID))

	scoresRef := firebase.Client.Collection(fmt.Sprintf("users/%s/scores", userID))

	docs := scoresRef.DocumentRefs(ctx)
	refs, err := docs.GetAll()
	if err != nil {
		return fmt.Errorf("failed to get scores collection documents: %w", err)
	}
	for _, ref := range refs {
		if _, err := ref.Delete(ctx); err != nil {
			return fmt.Errorf("failed to delete user score %s: %w", ref.ID, err)
		}
		slog.Info("Deleted user score", log.UserID(userID), slog.String("score", ref.ID))
	}

	return nil
}

func DeleteUserGames(ctx context.Context, userID string) error {
	slog.Info("Deleting user games ...", log.UserID(userID))

	gamesRef := firebase.Client.Collection(fmt.Sprintf("users/%s/usergames", userID))

	docs := gamesRef.DocumentRefs(ctx)
	refs, err := docs.GetAll()
	if err != nil {
		return fmt.Errorf("failed to get usergames collection documents: %w", err)
	}
	for _, ref := range refs {
		if _, err := ref.Delete(ctx); err != nil {
			return fmt.Errorf("failed to delete user game %s: %w", ref.ID, err)
		}
		slog.Info("Deleted user game", log.UserID(userID), log.GameID(ref.ID))
	}

	return nil
}
