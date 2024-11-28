import { GameLevel } from './game-level';
import { GameUser } from './game-user';

export interface Game {
  gameId: string
  currentLevelId: string
}

export const emptyGame: Game = { gameId: 'unknown', currentLevelId: '1' }