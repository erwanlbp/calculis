package httphelper

import (
	"encoding/json"
	"errors"
	"fmt"
	"log/slog"
	"net/http"

	"github.com/erwanlbp/calculis/pkg/log"
)

func WriteJSON[T any](rw http.ResponseWriter, status int, data T) {
	body := map[string]T{"data": data}

	b, err := json.Marshal(body)
	if err != nil {
		slog.Error("failed to marshal JSON response", log.Err(err))
		WriteError(rw, http.StatusInternalServerError, fmt.Errorf("failed to marshal JSON response: %w", err))
		return
	}
	rw.WriteHeader(status)
	if _, err := rw.Write(b); err != nil {
		slog.Error("failed to write JSON response", log.Err(err))
	}
}

func WriteError(rw http.ResponseWriter, status int, err error) {
	if err == nil {
		err = errors.New("unknown error")
	}
	b, _ := json.Marshal(map[string]string{"error": err.Error()})
	rw.WriteHeader(status)
	if _, err := rw.Write(b); err != nil {
		slog.Error("failed to write Error response", log.Err(err))
	}
}
