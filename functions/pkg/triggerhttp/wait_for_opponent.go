package triggerhttp

import (
	"encoding/json"
	"fmt"
	"log/slog"
	"net/http"

	"github.com/erwanlbp/calculis/pkg/firebase"
	"github.com/erwanlbp/calculis/pkg/httphelper"
	"github.com/erwanlbp/calculis/pkg/model"
)

func WaitForOpponent(rw http.ResponseWriter, req *http.Request) {
	ctx := req.Context()

	httphelper.DumpRequest(req)

	var payload struct {
		UserID string `json:"user_id"`
	}
	if err := json.NewDecoder(req.Body).Decode(&payload); err != nil {
		slog.Error("failed to decode body", slog.String("path", req.URL.Path), slog.String("err", err.Error()))
		httphelper.WriteError(rw, http.StatusBadRequest, err)
		return
	}

	doc := firebase.Client.Collection(fmt.Sprintf("users/%s/games", payload.UserID)).NewDoc()
	if _, err := doc.Set(ctx, model.UserGame{Status: model.StatusSearching}); err != nil {
		slog.Error("failed to create user game", slog.String("path", req.URL.Path), slog.String("err", err.Error()))
		httphelper.WriteError(rw, http.StatusInternalServerError, err)
	}

	httphelper.WriteJSON(rw, http.StatusOK, map[string]string{
		"game_id": doc.ID,
	})
}
