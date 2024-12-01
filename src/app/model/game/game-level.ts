import { GameLevelConfig } from './game-level-config';

export interface Numbers {
  numbers: []
}

export interface GameLevel {
  config: GameLevelConfig;
  numbers: Numbers;
}

export const emptyLevel: GameLevel = {config: {} as GameLevelConfig, numbers: {numbers: []} as Numbers}
