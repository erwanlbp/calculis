import { GameLevelConfig } from './game-level-config';

export interface Numbers {
  Numbers: []
}

export interface GameLevel {
  config: GameLevelConfig;
  numbers: Numbers;
}

export const emptyLevel: GameLevel = {config: {} as GameLevelConfig, numbers: {Numbers: []} as Numbers}
