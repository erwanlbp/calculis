package debug

import (
	"log/slog"
	"net/http"
	"net/http/httputil"

	"github.com/erwanlbp/calculis/pkg/log"
)

func DumpHTTPRequest(req *http.Request) {
	dump, err := httputil.DumpRequest(req, true)
	if err != nil {
		slog.Warn("failed to dump request", log.Err(err))
		return
	}
	slog.Info("request dump", slog.String("dump", string(dump)))
}
