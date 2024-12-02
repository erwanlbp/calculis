import { GameLevelConfig } from './game-level-config';

export interface Numbers {
  numbers: []
}

export interface GameLevel {
  status: string;
  config: GameLevelConfig;
  numbers: Numbers;
}

export const emptyLevel: GameLevel = {config: {} as GameLevelConfig, numbers: {numbers: []} as Numbers, status: 'unknown'}
