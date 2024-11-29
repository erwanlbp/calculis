import { GameLevelConfig } from './game-level-config';

export interface GameLevel {
  config: GameLevelConfig;
  numbers: number[];
}

export const emptyLevel: GameLevel = {config: {} as GameLevelConfig, numbers: []}
