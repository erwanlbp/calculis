package httphelper

import (
	"net/http"

	"github.com/rs/cors"
)

func Cors(next http.HandlerFunc) http.HandlerFunc {
	return cors.AllowAll().Handler(next).ServeHTTP
}
