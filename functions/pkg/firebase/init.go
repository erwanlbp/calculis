package firebase

import (
	"context"
	"log"

	"cloud.google.com/go/firestore"
)

var Client *firestore.Client

func init() {
	ctx := context.Background()

	client, err := firestore.NewClient(ctx, "calculis")
	if err != nil {
		log.Fatalf("firestore.NewClient: %v", err)
	}
	Client = client
}
