package firebase

import (
	"context"
	"log"

	firebase "firebase.google.com/go/v4"
	"firebase.google.com/go/v4/auth"
)

var AuthClient *auth.Client

func init() {
	ctx := context.Background()

	app, err := firebase.NewApp(ctx, &firebase.Config{
		ProjectID: "calculis",
	})
	if err != nil {
		log.Fatalf("firebase.NewApp: %v", err)
	}
	ac, err := app.Auth(ctx)
	if err != nil {
		log.Fatalf("firebase.NewApp: %v", err)
	}
	AuthClient = ac
}
