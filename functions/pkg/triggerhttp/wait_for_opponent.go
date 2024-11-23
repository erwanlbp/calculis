package triggerhttp

import (
	"context"
	"errors"
	"fmt"
	"log/slog"
	"net/http"

	firestorego "cloud.google.com/go/firestore"

	"github.com/erwanlbp/calculis/pkg/auth"
	"github.com/erwanlbp/calculis/pkg/firestore"
	firebase "github.com/erwanlbp/calculis/pkg/firestore"
	"github.com/erwanlbp/calculis/pkg/httphelper"
	"github.com/erwanlbp/calculis/pkg/model"
)

func WaitForOpponent(rw http.ResponseWriter, req *http.Request) {
	ctx := req.Context()

	userId, ok := auth.FromContext(req.Context())
	if !ok {
		slog.Error("request is missing userId in context")
		httphelper.WriteError(rw, http.StatusUnauthorized, errors.New("not authenticated"))
		return
	}

	doc := firebase.Client.Collection(fmt.Sprintf("users/%s/usergames", userId)).NewDoc()
	if _, err := doc.Set(ctx, model.UserGame{Status: model.StatusSearching, UserId: userId}); err != nil {
		slog.Error("failed to create user game", slog.String("err", err.Error()))
		httphelper.WriteError(rw, http.StatusInternalServerError, err)
		return
	}

	// Will try to create a game, if it fails, no problem, someone will find this user searching next time
	TryCreatingGame(req.Context(), userId, doc.ID)

	httphelper.WriteJSON(rw, http.StatusOK, map[string]string{
		"game_id": doc.ID,
	})
}

func TryCreatingGame(ctx context.Context, userId, userGameId string) {
	it := firebase.Client.CollectionGroup("usergames").
		Where("status", "==", model.StatusSearching).
		Where("userId", "!=", userId).
		Limit(1).
		Select("userId").
		Documents(ctx)

	foundPlayerDocsnapshots, err := it.GetAll()
	if err != nil {
		slog.Error("failed to search for opponent", slog.String("err", err.Error()))
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
		slog.Error("failed to unmarshal user game", slog.String("err", err.Error()), slog.Any("doc", foundPlayerDocsnapshot.Data()))
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
		if _, err := gameDoc.Set(ctx, model.Game{GameId: gameDoc.ID}); err != nil {
			slog.Error("failed to create game", slog.String("err", err.Error()), slog.String("userId", userId), slog.String("opponentId", foundPlayerDoc.UserId))
			return err
		}
		slog.Info("Created game " + gameDoc.ID)

		for _, p := range players {
			gameUserDoc := firestore.Client.Doc(fmt.Sprintf("games/%s/gameusers/%s", gameDoc.ID, p.UserId))
			if err := tx.Set(gameUserDoc, model.GameUser{UserPersonalGameId: p.UserGameId}); err != nil {
				slog.Error("failed to create gameuser doc", slog.String("err", err.Error()), slog.String("gameId", gameDoc.ID), slog.String("userId", p.UserId))
				return err
			}
			slog.Info("Created game user", slog.String("gameId", gameDoc.ID), slog.String("userId", p.UserId), slog.String("usergame", p.UserGameId))

			userGameDoc := firestore.Client.Doc(fmt.Sprintf("users/%s/usergames/%s", p.UserId, p.UserGameId))
			if err := tx.Update(userGameDoc, []firestorego.Update{
				{Path: "status", Value: model.StatusPlaying},
				{Path: "gameId", Value: gameDoc.ID},
			}); err != nil {
				slog.Error("failed to update usergame doc", slog.String("err", err.Error()), slog.String("gameId", gameDoc.ID), slog.String("userId", p.UserId), slog.String("usergame", p.UserGameId))
				return err
			}
			slog.Info("Updated user game", slog.String("gameId", gameDoc.ID), slog.String("userId", p.UserId), slog.String("usergame", p.UserGameId))
		}

		return nil
	}); err != nil {
		slog.Error("game creation tx failed", slog.String("err", err.Error()))
	}
}
