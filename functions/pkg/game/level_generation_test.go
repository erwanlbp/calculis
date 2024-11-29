package game_test

import (
	"fmt"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"

	"github.com/erwanlbp/calculis/pkg/game"
)

// To test the actual func that is used, with a lot of tries
func TestGenerateNumber(t *testing.T) {
	t.Parallel()

	for _, c := range []struct {
		rangeInput, expectedMin, expectedMax int
	}{
		{
			rangeInput:  5,
			expectedMin: -5,
			expectedMax: 5,
		},
		{
			rangeInput:  3,
			expectedMin: -3,
			expectedMax: 3,
		},
	} {
		t.Run(fmt.Sprintf("with_range_%d", c.rangeInput), func(t *testing.T) {
			t.Parallel()

			var minReached = c.expectedMax
			var maxReached = c.expectedMin

			var generatedAtLeastOneOf = make(map[int]bool)

			// Let's say if we try 1000 times and it work it's ok ?
			var tries = 1_000_000
			for range tries {
				out := game.GenerateNumber(c.rangeInput)
				generatedAtLeastOneOf[out] = true
				if out < minReached {
					minReached = out
				}
				if out > maxReached {
					maxReached = out
				}
				require.LessOrEqual(t, c.expectedMin, out, "value %d is out of range %d,%d", out, c.expectedMin, c.expectedMax)
				require.LessOrEqual(t, out, c.expectedMax, "value %d is out of range %d,%d", out, c.expectedMin, c.expectedMax)
			}
			require.Equal(t, c.expectedMin, minReached, "min reached %d is above the range min %d, maybe %d tries wasn't enough", minReached, c.expectedMin, tries)
			require.Equal(t, c.expectedMax, maxReached, "max reached %d is below the range max %d, maybe %d tries wasn't enough", maxReached, c.expectedMax, tries)

			// Test all numbers from the range are generated
			for i := c.expectedMin; i <= c.expectedMax; i++ {
				assert.Contains(t, generatedAtLeastOneOf, i, "number %d was never generated, maybe %d tries wasn't enough", i, tries)
			}
		})
	}
}
