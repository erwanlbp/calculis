package mainnotmain

import (
	"context"
	"fmt"
	"log"
	"strings"

	"github.com/GoogleCloudPlatform/functions-framework-go/functions"
	"github.com/cloudevents/sdk-go/v2/event"
	"github.com/erwanlbp/calculis/pkg/firebase"
	"github.com/googleapis/google-cloudevents-go/cloud/firestoredata"
	"google.golang.org/protobuf/proto"
)

func init() {
	// Register a CloudEvent function with the Functions Framework
	functions.CloudEvent("DeleteUserScoresOnUserDelete", DeleteUserScoresOnUserDeleteEntryPoint)
}

func DeleteUserScoresOnUserDeleteEntryPoint(ctx context.Context, protoEvent event.Event) error {
	var data firestoredata.DocumentEventData
	if err := proto.Unmarshal(protoEvent.Data(), &data); err != nil {
		return fmt.Errorf("proto.Unmarshal: %w", err)
	}

	refParts := strings.Split(data.GetOldValue().Name, "/")
	userId := refParts[len(refParts)-1]

	return DeleteUserScores(ctx, userId)
}

func DeleteUserScores(ctx context.Context, userID string) error {
	logger := log.Default()

	logger.Printf("Deleting user %s scores ...", userID)

	scoresRef := firebase.Client.Collection(fmt.Sprintf("users/%s/scores", userID))

	docs := scoresRef.DocumentRefs(ctx)
	refs, err := docs.GetAll()
	if err != nil {
		return fmt.Errorf("failed to get scores collection documents: %w", err)
	}
	for _, ref := range refs {
		if _, err := ref.Delete(ctx); err != nil {
			return fmt.Errorf("failed to delete user score %s: %w", ref.ID, err)
		}
		logger.Printf("Deleted user %s score %s ...", userID, ref.ID)
	}

	return nil
}
