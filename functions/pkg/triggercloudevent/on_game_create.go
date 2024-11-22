package triggercloudevent

import (
	"context"
	"fmt"
	"log/slog"
	"strings"

	firestorego "cloud.google.com/go/firestore"
	"github.com/cloudevents/sdk-go/v2/event"
	"github.com/googleapis/google-cloudevents-go/cloud/firestoredata"
	"google.golang.org/protobuf/proto"

	"github.com/erwanlbp/calculis/pkg/debug"
	"github.com/erwanlbp/calculis/pkg/firestore"
	"github.com/erwanlbp/calculis/pkg/model"
)

func OnGameCreateEntryPoint(ctx context.Context, protoEvent event.Event) error {
	var data firestoredata.DocumentEventData
	if err := proto.Unmarshal(protoEvent.Data(), &data); err != nil {
		return fmt.Errorf("proto.Unmarshal: %w", err)
	}

	debug.JSON(&data)

	refParts := strings.Split(data.GetValue().Name, "/")
	gameId := refParts[len(refParts)-1]

	var dto []model.GameCreateDto
	for _, e := range data.GetValue().Fields["create"].GetArrayValue().GetValues() {
		var item model.GameCreateDto
		for k, e := range e.GetMapValue().GetFields() {
			switch k {
			case "userId":
				item.UserId = e.GetStringValue()
			case "userPersonalGameId":
				item.UserPersonalGameId = e.GetStringValue()
			default:
				slog.Error("Unknown field", slog.String("key", k))
				return fmt.Errorf("unknown field")
			}
		}
		dto = append(dto, item)
	}

	return OnGameCreate(ctx, gameId, dto)
}

func OnGameCreate(ctx context.Context, gameId string, userGames []model.GameCreateDto) error {
	return firestore.Client.RunTransaction(ctx, func(ctx context.Context, tx *firestorego.Transaction) error {
		for _, userGame := range userGames {
			gameUserDoc := firestore.Client.Doc(fmt.Sprintf("games/%s/gameusers/%s", gameId, userGame.UserId))
			if err := tx.Set(gameUserDoc, model.GameUser{UserPersonalGameId: userGame.UserPersonalGameId}); err != nil {
				return fmt.Errorf("failed to create gameuser doc: %w", err)
			}
			slog.Info("Created game user", slog.String("gameId", gameId), slog.String("userId", userGame.UserId), slog.String("usergame", userGame.UserPersonalGameId))

			userGameDoc := firestore.Client.Doc(fmt.Sprintf("users/%s/usergames/%s", userGame.UserId, userGame.UserPersonalGameId))
			if err := tx.Update(userGameDoc, []firestorego.Update{{Path: "status", Value: model.StatusPlaying}}); err != nil {
				return fmt.Errorf("failed to update usergame doc: %w", err)
			}
			slog.Info("Updated user game", slog.String("gameId", gameId), slog.String("userId", userGame.UserId), slog.String("usergame", userGame.UserPersonalGameId))
		}
		return nil
	})
}
