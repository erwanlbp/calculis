package mainnotmain

import (
	"github.com/GoogleCloudPlatform/functions-framework-go/functions"

	"github.com/erwanlbp/calculis/pkg/auth"
	"github.com/erwanlbp/calculis/pkg/httphelper"
	"github.com/erwanlbp/calculis/pkg/triggercloudevent"
	"github.com/erwanlbp/calculis/pkg/triggerhttp"
)

func init() {
	// Cloud Event
	functions.CloudEvent("OnUserDelete", triggercloudevent.OnUserDeleteEntryPoint)
	functions.CloudEvent("OnGameCreate", triggercloudevent.OnGameCreateEntryPoint)

	// Http
	functions.HTTP("WaitForOpponent", httphelper.Cors(auth.Middleware(triggerhttp.WaitForOpponent)))
}
