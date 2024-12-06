package notification

import (
	"context"
	"fmt"
	"log/slog"

	"firebase.google.com/go/v4/messaging"

	"github.com/erwanlbp/calculis/pkg/firebase"
	"github.com/erwanlbp/calculis/pkg/firestore"
	"github.com/erwanlbp/calculis/pkg/log"
	"github.com/erwanlbp/calculis/pkg/model"
)

func SendGameCreatedNotification(ctx context.Context, logger *slog.Logger, gameID, userID string) {
	tokens, err := GetUsersFCMToken(ctx, userID)
	if err != nil {
		logger.Error("Failed to get user FCM token", log.Err(err))
		return
	}
	if tokens[userID] == "" {
		logger.Info("User does not have a FCM token, can't send notification")
		return
	}

	if err := SendNotif(ctx, []string{tokens[userID]},
		map[string]string{
			"type":   "game_created",
			"gameId": gameID,
		},
		fmt.Sprintf("Défi accepté !\nLa partie %s est lancée !", gameID),
	); err != nil {
		logger.Error("Failed to send game created notification", log.Err(err))
		return
	}

	logger.Info("Sent game created notification")
}

func SendLevelFinishedNotification(ctx context.Context, logger *slog.Logger, gameID, omitUserID string, status model.LevelStatusAfterFinish, correctUsers map[bool][]string) {
	var allUserIDs []string
	for _, userIDs := range correctUsers {
		for _, userID := range userIDs {
			if userID == omitUserID {
				continue
			}
			allUserIDs = append(allUserIDs, userID)
		}
	}
	tokens, err := GetUsersFCMToken(ctx, allUserIDs...)
	if err != nil {
		logger.Error("Failed to get users FCM token", log.Err(err), log.UserIDs(allUserIDs))
		return
	}

	// Replace userIDs in correctUsers by their tokens, if set
	for correct := range correctUsers {
		var userIDs []string
		for _, userID := range correctUsers[correct] {
			if token := tokens[userID]; token != "" {
				userIDs = append(userIDs, token)
			}
		}
		correctUsers[correct] = userIDs
	}

	data := map[string]string{
		"gameId": gameID,
		"type":   "tbd",
	}

	switch status {
	case model.LevelStatusAllUsersCorrect:
		if err := SendNotif(ctx, correctUsers[true], data, "Le niveau était trop facile ! La partie "+gameID+" continue !"); err != nil {
			logger.Error("Failed to send LevelStatusAllUsersCorrect true notifs", log.Err(err))
		}
	case model.LevelStatusMultipleUsersCorrect:
		if err := SendNotif(ctx, correctUsers[true], data, fmt.Sprintf("%d joueurs éliminés ! La partie "+gameID+" continue !", len(correctUsers[false]))); err != nil {
			logger.Error("Failed to send LevelStatusMultipleUsersCorrect true notifs", log.Err(err))
		}
		if err := SendNotif(ctx, correctUsers[false], data, "Mauvaise réponse ! La partie "+gameID+" s'arrete !"); err != nil {
			logger.Error("Failed to send LevelStatusMultipleUsersCorrect false notifs", log.Err(err))
		}
	case model.LevelStatusOnlyOneCorrect:
		if err := SendNotif(ctx, correctUsers[true], data, "C'est gagné ! Fin de la partie "+gameID); err != nil {
			logger.Error("Failed to send LevelStatusOnlyOneCorrect true notifs", log.Err(err))
		}
		if err := SendNotif(ctx, correctUsers[false], data, "Mauvais réponse ! La partie "+gameID+" s'arrete !"); err != nil {
			logger.Error("Failed to send LevelStatusOnlyOneCorrect false notifs", log.Err(err))
		}
	case model.LevelStatusNoUserCorrect:
		if err := SendNotif(ctx, correctUsers[false], data, "Egalité ! La partie "+gameID+" s'arrete, personne n'y arrive !"); err != nil {
			logger.Error("Failed to send LevelStatusNoUserCorrect false notifs", log.Err(err))
		}
	default:
		logger.Error("unplanned level status after finish, can't send notifs")
		return
	}
}

func SendNotif(ctx context.Context, tokens []string, data map[string]string, body string, optionalTitle ...string) error {
	if len(tokens) == 0 {
		return nil
	}
	title := "Calculis"
	if len(optionalTitle) > 0 {
		title = optionalTitle[0]
	}
	res, err := firebase.MessagingClient.SendEachForMulticast(ctx, &messaging.MulticastMessage{
		Tokens: tokens,
		Data:   data,
		Webpush: &messaging.WebpushConfig{
			Data: data,
			Notification: &messaging.WebpushNotification{
				Title: title + " (Webpush)",
				Body:  body,
			},
		},
		Notification: &messaging.Notification{
			Title: title + " (Notification)",
			Body:  body,
		},
	})
	if err != nil {
		return err
	}

	if res.FailureCount > 0 {
		return fmt.Errorf("failed to send %d notifs", res.FailureCount)
	}

	return nil
}

func GetUsersFCMToken(ctx context.Context, userID ...string) (map[string]string, error) {
	if len(userID) == 0 {
		return map[string]string{}, nil
	}
	docs, err := firestore.Client.CollectionGroup("users").
		Where("userId", "in", userID).
		Select("userId", "fcmToken").
		Documents(ctx).
		GetAll()
	if err != nil {
		return nil, fmt.Errorf("failed to get users doc: %w", err)
	}

	var res map[string]string = make(map[string]string)
	for _, userDoc := range docs {
		var data struct {
			UserID   string `firestore:"userId"`
			FCMToken string `firestore:"fcmToken"`
		}
		if err := userDoc.DataTo(&data); err != nil {
			return nil, fmt.Errorf("failed to unmarshal user(%s) doc: %w", userDoc.Ref.ID, err)
		}
		res[data.UserID] = data.FCMToken
	}
	return res, nil
}
