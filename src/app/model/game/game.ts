import { GameLevel } from './game-level';
import { GameUser } from './game-user';

export interface Game {
  gameLevels: GameLevel[];
  gameUsers: GameUser[];
}
