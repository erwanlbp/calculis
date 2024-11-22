package triggerhttp

import (
	"errors"
	"fmt"
	"log/slog"
	"net/http"

	"github.com/erwanlbp/calculis/pkg/auth"
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

	doc := firebase.Client.Collection(fmt.Sprintf("users/%s/games", userId)).NewDoc()
	if _, err := doc.Set(ctx, model.UserGame{Status: model.StatusSearching}); err != nil {
		slog.Error("failed to create user game", slog.String("err", err.Error()))
		httphelper.WriteError(rw, http.StatusInternalServerError, err)
	}

	httphelper.WriteJSON(rw, http.StatusOK, map[string]string{
		"game_id": doc.ID,
	})
}
