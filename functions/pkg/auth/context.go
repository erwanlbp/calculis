package auth

import "context"

type userIdCtx string

const ctxKey userIdCtx = "user_id"

func FromContext(ctx context.Context) (string, bool) {
	val, ok := ctx.Value(ctxKey).(string)
	return val, ok
}

func toContext(ctx context.Context, userId string) context.Context {
	return context.WithValue(ctx, ctxKey, userId)
}
