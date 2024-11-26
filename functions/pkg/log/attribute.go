package log

import "log/slog"

func Err(err error) slog.Attr {
	if err == nil {
		slog.String("err", "")
	}
	return slog.String("err", err.Error())
}

func GameID(val string) slog.Attr     { return slog.String("gameId", val) }
func UserGameID(val string) slog.Attr { return slog.String("userGameID", val) }
func LevelID(val string) slog.Attr    { return slog.String("levelId", val) }
func UserID(val string) slog.Attr     { return slog.String("userId", val) }
