package triggerhttp

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"log/slog"
	"net/http"

	firestorego "cloud.google.com/go/firestore"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"

	"github.com/erwanlbp/calculis/pkg/auth"
	"github.com/erwanlbp/calculis/pkg/firestore"
	"github.com/erwanlbp/calculis/pkg/httphelper"
	"github.com/erwanlbp/calculis/pkg/log"
	"github.com/erwanlbp/calculis/pkg/model"
)

func UserLevelAnswer(rw http.ResponseWriter, req *http.Request) {
	ctx := req.Context()

	userId, ok := auth.FromContext(req.Context())
	if !ok {
		slog.Error("request is missing userId in context")
		httphelper.WriteError(rw, http.StatusUnauthorized, errors.New("not authenticated"))
		return
	}

	var body struct {
		GameID  string `json:"gameId"`
		LevelID string `json:"levelId"`
		Answer  int    `json:"answer"`
	}
	if err := json.NewDecoder(req.Body).Decode(&body); err != nil {
		slog.Error("failed to decode body", log.Err(err))
		httphelper.WriteError(rw, http.StatusBadRequest, fmt.Errorf("failed to decode body: %w", err))
		return
	}
	if body.GameID == "" {
		httphelper.WriteError(rw, http.StatusBadRequest, errors.New("missing gameId"))
		return
	}
	if body.LevelID == "" {
		httphelper.WriteError(rw, http.StatusBadRequest, errors.New("missing levelId"))
		return
	}

	logger := slog.Default().With(log.GameID(body.GameID), log.LevelID(body.LevelID), log.UserID(userId))

	// Validate user belongs to the game
	_, err := firestore.Client.Doc(fmt.Sprintf("games/%s/gameusers/%s", body.GameID, userId)).Get(ctx)
	if status.Code(err) == codes.NotFound {
		httphelper.WriteError(rw, http.StatusForbidden, errors.New("level not found"))
		return
	}
	if err != nil {
		logger.Error("failed to check if user belongs to the game", log.Err(err))
		httphelper.WriteError(rw, http.StatusInternalServerError, fmt.Errorf("failed to check if user belongs to the game"))
		return
	}

	// Get level's doc
	levelRef := firestore.Client.Doc(fmt.Sprintf("games/%s/gamelevels/%s", body.GameID, body.LevelID))
	levelDoc, err := levelRef.Get(ctx)
	if status.Code(err) == codes.NotFound {
		httphelper.WriteError(rw, http.StatusBadRequest, errors.New("level not found"))
		return
	}
	if err != nil {
		logger.Error("failed to find level doc", log.Err(err))
		httphelper.WriteError(rw, http.StatusInternalServerError, fmt.Errorf("failed to find level"))
		return
	}
	var level model.GameLevel
	if err := levelDoc.DataTo(&level); err != nil {
		logger.Error("failed to unmarshal level doc", log.Err(err), slog.Any("data", levelDoc.Data()))
		httphelper.WriteError(rw, http.StatusInternalServerError, fmt.Errorf("failed to find level"))
		return
	}
	if level.UsersAnswer == nil {
		level.UsersAnswer = make(map[string]model.UserAnswer)
	}
	level.UsersAnswer[userId] = model.UserAnswer{
		Correct: body.Answer == level.CorrectAnswer(),
	}

	if err := firestore.Client.RunTransaction(ctx, func(ctx context.Context, tx *firestorego.Transaction) error {
		// Update game level
		if err := tx.Set(levelRef, level); err != nil {
			logger.Error("failed to update level doc", log.Err(err))
			return fmt.Errorf("failed to update level: %w", err)
		}

		// Find usergame doc
		gameUserDoc, err := firestore.Client.Doc(fmt.Sprintf("/games/%s/gameusers/%s", body.GameID, userId)).Get(ctx)
		if err != nil {
			logger.Error("failed to get game user doc", log.Err(err))
			return fmt.Errorf("failed to get game user doc: %w", err)
		}
		var gameUser model.GameUser
		if err := gameUserDoc.DataTo(&gameUser); err != nil {
			logger.Error("failed to unmarshal game user doc", log.Err(err), slog.Any("data", gameUserDoc.Data()))
			return fmt.Errorf("failed to unmarshal game user doc: %w", err)
		}

		logger := logger.With(log.UserGameID(gameUser.UserPersonalGameId))

		// Update usergame status
		userGameRef := firestore.Client.Doc(fmt.Sprintf("/users/%s/usergames/%s", userId, gameUser.UserPersonalGameId))
		if err := tx.Update(userGameRef, []firestorego.Update{{Path: "status", Value: model.StatusWaiting}}); err != nil {
			logger.Error("failed to update usergame doc", log.Err(err))
			return fmt.Errorf("failed to update usergame doc: %w", err)
		}

		return nil
	}); err != nil {
		logger.Error("failed to run user answer tx", log.Err(err))
		httphelper.WriteError(rw, http.StatusInternalServerError, fmt.Errorf("failed to run user answer flow"))
		return
	}

	httphelper.WriteJSON(rw, http.StatusOK, map[string]interface{}{
		"correct":        body.Answer == level.CorrectAnswer(),
		"correct_answer": level.CorrectAnswer(),
	})
}
