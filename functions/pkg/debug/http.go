package debug

import (
	"log/slog"
	"net/http"
	"net/http/httputil"
)

func DumpHTTPRequest(req *http.Request) {
	dump, err := httputil.DumpRequest(req, true)
	if err != nil {
		slog.Warn("failed to dump request", slog.String("err", err.Error()))
		return
	}
	slog.Info("request dump", slog.String("dump", string(dump)))
}
