package debug

import (
	"encoding/json"
	"log/slog"
)

func JSON[T any](data T) {
	b, err := json.Marshal(data)
	if err != nil {
		slog.Warn("failed to marshal to json for debug", slog.Any("data", data))
		return
	}
	slog.Info("debug", slog.String("data", string(b)))
}
