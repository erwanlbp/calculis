package notification

import (
	"context"
	"fmt"
	"log/slog"

	"firebase.google.com/go/v4/messaging"

	"github.com/erwanlbp/calculis/pkg/firebase"
	"github.com/erwanlbp/calculis/pkg/firestore"
	"github.com/erwanlbp/calculis/pkg/log"
)

func SendGameCreatedNotification(ctx context.Context, logger *slog.Logger, gameID, userID string) {
	token, err := GetUserFCMToken(ctx, userID)
	if err != nil {
		logger.Error("Failed to get user FCM token", log.Err(err))
		return
	}
	if token == "" {
		logger.Info("User does not have a FCM token, can't send notification")
		return
	}

	data := map[string]string{
		"type":   "game_created",
		"gameId": gameID,
	}

	res, err := firebase.MessagingClient.Send(ctx, &messaging.Message{
		Token: token,
		Data:  data,
		Webpush: &messaging.WebpushConfig{
			Data: data,
			Notification: &messaging.WebpushNotification{
				Title: "Calculis - Webpush",
				Body:  "La game est créée",
			},
		},
		Notification: &messaging.Notification{
			Title: "Calculis - Notification",
			Body:  "La game est créée",
		},
	})
	if err != nil {
		logger.Error("Failed to send game created notification", log.Err(err))
		return
	}

	logger.Info("Sent game created notification", slog.String("res", res))
}

func GetUserFCMToken(ctx context.Context, userID string) (string, error) {
	userDoc, err := firestore.Client.Doc(fmt.Sprintf("users/%s", userID)).Get(ctx)
	if err != nil {
		return "", fmt.Errorf("failed to get user doc: %w", err)
	}

	var data struct {
		FCMToken string `firestore:"fcmToken"`
	}
	if err := userDoc.DataTo(&data); err != nil {
		return "", fmt.Errorf("failed to unmarshal user doc: %w", err)
	}

	return data.FCMToken, nil
}
