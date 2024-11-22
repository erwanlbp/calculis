package triggerhttp

import (
	"errors"
	"fmt"
	"log/slog"
	"net/http"

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

	endpointResponse := map[string]string{
		"game_id": doc.ID,
	}

	it := firebase.Client.CollectionGroup("usergames").
		Where("status", "==", model.StatusSearching).
		Where("userId", "!=", userId).
		Limit(1).
		Select("userId").
		Documents(ctx)

	foundPlayerDocsnapshots, err := it.GetAll()
	if err != nil {
		slog.Error("failed to search for opponent", slog.String("err", err.Error()))
		httphelper.WriteError(rw, http.StatusInternalServerError, err)
		return
	}
	if len(foundPlayerDocsnapshots) == 0 {
		// No one is looking for a game, stop there, user game is in search mode
		slog.Info("No one else is looking for a game", slog.String("userId", userId))
		httphelper.WriteJSON(rw, http.StatusOK, endpointResponse)
		return
	}
	foundPlayerDocsnapshot := foundPlayerDocsnapshots[0]

	// Opponent has been found, trigger the game creation

	var foundPlayerDoc model.UserGame
	if err := foundPlayerDocsnapshot.DataTo(&foundPlayerDoc); err != nil {
		slog.Error("failed to unmarshal user game", slog.String("err", err.Error()), slog.Any("doc", foundPlayerDocsnapshot.Data()))
		httphelper.WriteError(rw, http.StatusInternalServerError, err)
		return
	}
	slog.Info("Found user to match against", slog.String("userId", userId), slog.String("opponentId", foundPlayerDoc.UserId))

	if err := firestore.CreateGame(ctx, []firebase.CreateGameDto{
		{UserId: userId, UserGameId: doc.ID},
		{UserId: foundPlayerDoc.UserId, UserGameId: foundPlayerDocsnapshot.Ref.ID},
	}); err != nil {
		slog.Error("failed to create game", slog.String("err", err.Error()), slog.String("userId", userId), slog.String("opponentId", foundPlayerDoc.UserId))
		httphelper.WriteError(rw, http.StatusInternalServerError, err)
		return
	}

	httphelper.WriteJSON(rw, http.StatusOK, endpointResponse)
}
