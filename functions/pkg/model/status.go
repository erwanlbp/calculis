package model

type Status string

const (
	StatusSearching Status = "searching"
	StatusPlaying   Status = "playing"
	StatusPlayed    Status = "played"
	StatusLost      Status = "lost"
	StatusTie       Status = "tie"
	StatusWon       Status = "won"
	StatusWaiting   Status = "waiting"
)
