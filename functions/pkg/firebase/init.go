package firebase

import (
	"context"
	"log"

	firebase "firebase.google.com/go/v4"
	"firebase.google.com/go/v4/auth"
	"firebase.google.com/go/v4/messaging"
)

var AuthClient *auth.Client
var MessagingClient *messaging.Client

func init() {
	ctx := context.Background()

	app, err := firebase.NewApp(ctx, &firebase.Config{
		ProjectID: "calculis",
	})
	if err != nil {
		log.Fatalf("firebase.NewApp: %v", err)
	}

	// Auth
	ac, err := app.Auth(ctx)
	if err != nil {
		log.Fatalf("app.Auth: %v", err)
	}
	AuthClient = ac

	// Messaging
	mc, err := app.Messaging(ctx)
	if err != nil {
		log.Fatalf("app.Messaging: %v", err)
	}
	MessagingClient = mc
}
