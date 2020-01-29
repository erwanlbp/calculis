export enum GameDifficulty {
    EASY = 'easy',
    MEDIUM = 'medium',
    HARD = 'hard',
}

export function timeToPrintFromDifficulty(difficulty: GameDifficulty): number {
    switch (difficulty) {
        case GameDifficulty.EASY:
            return 2000;
        case GameDifficulty.MEDIUM:
            return 1300;
        case GameDifficulty.HARD:
            return 800;
    }
    return 1000;
}
