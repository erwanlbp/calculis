export interface Game {
  gameId: string
  currentLevelId: string
}

export const emptyGame: Game = {gameId: 'unknown', currentLevelId: '1'}
