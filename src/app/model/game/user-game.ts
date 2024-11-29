export interface UserGame {
  gameId: string;
  currentLevelId: string;
}

export const emptyUserGame: UserGame = {gameId: 'unknown', currentLevelId: '1'}
