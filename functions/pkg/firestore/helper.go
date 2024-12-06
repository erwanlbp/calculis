package firestore

import (
	"context"
	"fmt"

	firestorego "cloud.google.com/go/firestore"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func UserBelongsToGame(ctx context.Context, userID, gameID, levelID string) (bool, *firestorego.DocumentSnapshot, error) {
	doc, err := Client.Doc(fmt.Sprintf("games/%s/gameusers/%s", gameID, userID)).Get(ctx)
	if status.Code(err) == codes.NotFound {
		return false, nil, nil
	}
	if err != nil {
		return false, nil, err
	}
	return true, doc, nil
}
