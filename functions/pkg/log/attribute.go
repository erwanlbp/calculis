package log

import (
	"log/slog"

	"github.com/erwanlbp/calculis/pkg/model"
)

func Err(err error) slog.Attr {
	if err == nil {
		slog.String("err", "")
	}
	return slog.String("err", err.Error())
}

func GameID(val string) slog.Attr       { return slog.String("gameId", val) }
func UserGameID(val string) slog.Attr   { return slog.String("userGameID", val) }
func LevelID(val string) slog.Attr      { return slog.String("levelId", val) }
func UserID(val string) slog.Attr       { return slog.String("userId", val) }
func PlayerID(val string) slog.Attr     { return slog.String("playerId", val) }
func Status(val model.Status) slog.Attr { return slog.String("status", string(val)) }
func EndLevelStatus(val model.LevelStatusAfterFinish) slog.Attr {
	return slog.String("end_level_status", string(val))
}
func Caller(val string) slog.Attr { return slog.String("caller", val) }
