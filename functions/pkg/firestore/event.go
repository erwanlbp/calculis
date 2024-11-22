package firestore

import "time"

// FirestoreEvent is the payload of a Firestore event.
type FirestoreEvent[T any] struct {
	OldValue   FirestoreValue[T] `json:"oldValue"`
	Value      FirestoreValue[T] `json:"value"`
	UpdateMask struct {
		FieldPaths []string `json:"fieldPaths"`
	} `json:"updateMask"`
}

// FirestoreValue holds Firestore fields.
type FirestoreValue[T any] struct {
	CreateTime time.Time `json:"createTime"`
	// Fields is the data for this value. The type depends on the format of your
	// database. Log an interface{} value and inspect the result to see a JSON
	// representation of your database fields.
	Fields     T         `json:"fields"`
	Name       string    `json:"name"`
	UpdateTime time.Time `json:"updateTime"`
}
