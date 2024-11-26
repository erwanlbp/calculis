import { GameLevelConfig } from './game-level-config';

export interface GameLevel {
  config: GameLevelConfig;
  numbers: number[];
}
