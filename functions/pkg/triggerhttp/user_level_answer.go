package triggerhttp

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"log/slog"
	"net/http"

	firestorego "cloud.google.com/go/firestore"

	"github.com/erwanlbp/calculis/pkg/auth"
	"github.com/erwanlbp/calculis/pkg/firestore"
	"github.com/erwanlbp/calculis/pkg/game"
	"github.com/erwanlbp/calculis/pkg/httphelper"
	"github.com/erwanlbp/calculis/pkg/log"
	"github.com/erwanlbp/calculis/pkg/model"
)

func UserLevelAnswer(rw http.ResponseWriter, req *http.Request) {
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
			Forfeit bool   `json:"forfeit"`
			GameID  string `json:"game_id"`
			LevelID string `json:"level_id"`
			Answer  int    `json:"answer"`
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

	// Get level's doc
	level, levelRef, err := game.GetGameLevel(ctx, logger, body.GameID, body.LevelID)
	if errors.Is(err, game.ErrNotFound) {
		httphelper.WriteError(rw, http.StatusNotFound, game.ErrNotFound)
		return
	}
	if err != nil {
		logger.Error("cannot find game level", log.Err(err))
		httphelper.WriteError(rw, http.StatusInternalServerError, fmt.Errorf("cannot find game: %w", err))
		return
	}

	// If level already contains UsersAnswer for user, fail
	if _, exists := level.UsersAnswer[userId]; exists {
		logger.Error("user already answered")
		httphelper.WriteError(rw, http.StatusForbidden, errors.New("already_answered"))
		return
	}

	level.UsersAnswer[userId] = model.UserAnswer{
		Correct: !body.Forfeit && body.Answer == level.CorrectAnswer(),
	}
	// Just for security
	level.UsersFetchedLevel[userId] = true

	if err := firestore.Client.RunTransaction(ctx, func(ctx context.Context, tx *firestorego.Transaction) error {
		// Update game level
		if err := tx.Set(levelRef, level); err != nil {
			logger.Error("failed to update level doc", log.Err(err))
			return fmt.Errorf("failed to update level: %w", err)
		}

		logger.Info("Updated level with user answer", slog.Any("usersAnswer", level.UsersAnswer))

		// Update usergame status
		userGameRef := firestore.Client.Doc(fmt.Sprintf("users/%s/usergames/%s", userId, body.GameID))
		if err := tx.Update(userGameRef, []firestorego.Update{{Path: "status", Value: model.StatusWaiting}}); err != nil {
			logger.Error("failed to update usergame doc", log.Err(err))
			return fmt.Errorf("failed to update usergame doc: %w", err)
		}

		logger.Info("Updated user game status", log.Status(model.StatusWaiting))

		return nil
	}); err != nil {
		logger.Error("failed to run user answer tx", log.Err(err))
		httphelper.WriteError(rw, http.StatusInternalServerError, fmt.Errorf("failed to run user answer flow"))
		return
	}

	if len(level.UsersAnswer) >= level.PlayersCount {
		logger.Info("Finishing level ...")
		game.FinishLevel(ctx, logger, body.GameID, body.LevelID)
	} else {
		logger.Info("Level is not finished", slog.Int("answersCount", len(level.UsersAnswer)), slog.Int("playersCount", level.PlayersCount))
	}

	httphelper.WriteJSON(rw, http.StatusOK, map[string]interface{}{
		"correct":        !body.Forfeit && body.Answer == level.CorrectAnswer(),
		"correct_answer": level.CorrectAnswer(),
	})
}
