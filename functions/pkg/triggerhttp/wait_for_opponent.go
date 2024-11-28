package triggerhttp

import (
	"errors"
	"fmt"
	"log/slog"
	"net/http"

	"github.com/erwanlbp/calculis/pkg/auth"
	"github.com/erwanlbp/calculis/pkg/firestore"
	"github.com/erwanlbp/calculis/pkg/game"
	"github.com/erwanlbp/calculis/pkg/httphelper"
	"github.com/erwanlbp/calculis/pkg/log"
	"github.com/erwanlbp/calculis/pkg/model"
)

func WaitForOpponent(rw http.ResponseWriter, req *http.Request) {
	// TODO Add lock per user

	ctx := req.Context()

	logger := slog.Default().With(log.Caller("WaitForOpponent"))

	userId, ok := auth.FromContext(ctx)
	if !ok {
		logger.Error("request is missing userId in context")
		httphelper.WriteError(rw, http.StatusUnauthorized, errors.New("not authenticated"))
		return
	}

	logger = logger.With(log.UserID(userId))

	doc := firestore.Client.Collection(fmt.Sprintf("users/%s/usergames", userId)).NewDoc()
	if _, err := doc.Set(ctx, model.UserGame{GameID: doc.ID, Status: model.StatusSearching, UserID: userId}); err != nil {
		logger.Error("failed to create user game", log.Err(err))
		httphelper.WriteError(rw, http.StatusInternalServerError, err)
		return
	}

	// Will try to create a game, if it fails, no problem, someone will find this user searching next time
	game.TryCreatingGame(ctx, logger, userId, doc.ID)

	httphelper.WriteJSON(rw, http.StatusOK, map[string]string{
		"game_id": doc.ID,
	})
}
