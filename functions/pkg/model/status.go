package model

type Status string

const (
	StatusSearching Status = "searching"
	StatusPlaying   Status = "playing"
	StatusWaiting   Status = "waiting"
)
