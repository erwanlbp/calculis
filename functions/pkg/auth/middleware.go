package auth

import (
	"errors"
	"net/http"
	"strings"

	"github.com/erwanlbp/calculis/pkg/firebase"
	"github.com/erwanlbp/calculis/pkg/httphelper"
)

// Check the Authorization bearer token against firebase to make sure the request is authenticated
func Middleware(next http.HandlerFunc) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		header := strings.TrimPrefix(r.Header.Get("Authorization"), "Bearer ")

		tkn, err := firebase.AuthClient.VerifyIDToken(r.Context(), header)
		if err != nil {
			httphelper.WriteError(w, http.StatusForbidden, errors.New("forbidden"))
			return
		}

		r = r.WithContext(toContext(r.Context(), tkn.UID))

		next.ServeHTTP(w, r)
	})
}
