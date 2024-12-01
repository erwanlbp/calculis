export interface UserGame {
  gameId: string;
  currentLevelId: string;
  status: string;
}

export const emptyUserGame: UserGame = { gameId: 'unknown', currentLevelId: '1', status: 'unknown' }
