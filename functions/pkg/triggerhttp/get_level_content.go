package triggerhttp

import (
	"encoding/json"
	"errors"
	"fmt"
	"log/slog"
	"net/http"

	"github.com/erwanlbp/calculis/pkg/auth"
	"github.com/erwanlbp/calculis/pkg/dto"
	"github.com/erwanlbp/calculis/pkg/firestore"
	"github.com/erwanlbp/calculis/pkg/game"
	"github.com/erwanlbp/calculis/pkg/httphelper"
	"github.com/erwanlbp/calculis/pkg/log"
)

func GetLevelContent(rw http.ResponseWriter, req *http.Request) {
	// TODO Add lock per level

	ctx := req.Context()

	userId, ok := auth.FromContext(req.Context())
	if !ok {
		slog.Error("request is missing userId in context")
		httphelper.WriteError(rw, http.StatusUnauthorized, errors.New("not authenticated"))
		return
	}

	var data struct {
		Data struct {
			GameID  string `json:"game_id"`
			LevelID string `json:"level_id"`
		} `json:"data"`
	}
	if err := json.NewDecoder(req.Body).Decode(&data); err != nil {
		slog.Error("failed to decode body", log.Err(err))
		httphelper.WriteError(rw, http.StatusBadRequest, fmt.Errorf("failed to decode body: %w", err))
		return
	}
	body := data.Data
	if body.GameID == "" {
		httphelper.WriteError(rw, http.StatusBadRequest, errors.New("missing gameId"))
		return
	}
	if body.LevelID == "" {
		httphelper.WriteError(rw, http.StatusBadRequest, errors.New("missing levelId"))
		return
	}

	logger := slog.Default().With(log.GameID(body.GameID), log.LevelID(body.LevelID), log.UserID(userId))

	if ok, _, err := firestore.UserBelongsToGame(ctx, userId, body.GameID, body.LevelID); err != nil {
		logger.Error("failed to check if user belongs to the game", log.Err(err))
		httphelper.WriteError(rw, http.StatusInternalServerError, fmt.Errorf("failed to check if user belongs to the game"))
		return
	} else if !ok {
		logger.Error("user does not belong to game")
		httphelper.WriteError(rw, http.StatusForbidden, errors.New("level not found"))
		return
	}

	// Get gameusers doc
	level, levelRef, err := game.GetGameLevel(ctx, logger, body.GameID, body.LevelID)
	if errors.Is(err, game.ErrNotFound) {
		httphelper.WriteError(rw, http.StatusNotFound, game.ErrNotFound)
		return
	}
	if err != nil {
		logger.Error("cannot find game level", log.Err(err))
		httphelper.WriteError(rw, http.StatusInternalServerError, fmt.Errorf("cannot find game level: %w", err))
		return
	}

	if level.UsersFetchedLevel[userId] {
		logger.Error("user already fetched level")
		httphelper.WriteError(rw, http.StatusForbidden, errors.New("already_fetched"))
		return
	}

	level.UsersFetchedLevel[userId] = true

	// Update game level with usersAnswered
	if _, err := levelRef.Set(ctx, level); err != nil {
		logger.Error("failed to update level doc", log.Err(err))
		httphelper.WriteError(rw, http.StatusInternalServerError, fmt.Errorf("failed to update level with user answered"))
		return
	}
	logger.Info("Updated level with user answered", slog.Any("usersAnswered", level.UsersFetchedLevel))

	httphelper.WriteJSON(rw, http.StatusOK, dto.MapGetLevelContentResponse(*level))
}
