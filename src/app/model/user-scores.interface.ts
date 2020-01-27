import { GameDifficulty } from './game-difficulty.enum';

export interface UserScore {
    difficulty: GameDifficulty;
    score: number;
}
