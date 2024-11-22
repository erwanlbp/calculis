package httphelper

import (
	"encoding/json"
	"errors"
	"fmt"
	"log/slog"
	"net/http"
	"net/http/httputil"
)

func WriteJSON[T any](rw http.ResponseWriter, status int, data T) {
	body := map[string]T{"data": data}

	b, err := json.Marshal(body)
	if err != nil {
		slog.Error("failed to marshal JSON response", slog.String("error", err.Error()))
		WriteError(rw, http.StatusInternalServerError, fmt.Errorf("failed to marshal JSON response: %w", err))
		return
	}
	rw.WriteHeader(status)
	if _, err := rw.Write(b); err != nil {
		slog.Error("failed to write JSON response", slog.String("error", err.Error()))
	}
}

func WriteError(rw http.ResponseWriter, status int, err error) {
	if err != nil {
		err = errors.New("unknown error")
	}
	b, _ := json.Marshal(map[string]string{"error": err.Error()})
	rw.WriteHeader(status)
	if _, err := rw.Write(b); err != nil {
		slog.Error("failed to write Error response", slog.String("error", err.Error()))
	}
}

func DumpRequest(req *http.Request) {
	dump, err := httputil.DumpRequest(req, true)
	if err != nil {
		slog.Warn("failed to dump request", slog.String("err", err.Error()))
		return
	}
	slog.Debug("request dump", slog.String("path", req.URL.Path), slog.String("dump", string(dump)))
}
