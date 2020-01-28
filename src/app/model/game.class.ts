import { GameConfig } from './game-config.interface';
import { Observable, timer } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { GameDifficulty } from './game-difficulty.enum';

export class Game {

    private numbers: number[] = [];
    config: GameConfig;
    private actualSerieSize: number;
    level: number;
    difficulty: GameDifficulty;

    constructor(difficulty: GameDifficulty, level: number, config: GameConfig) {
        this.difficulty = difficulty;
        this.level = level;
        this.config = config;
        console.log('game config for level', level, 'of difficulty', difficulty, ':', this.config);
        this.actualSerieSize = config.serieSize + 2;
    }

    public getNumbers(): number[] {
        if (this.numbers.length === 0) {
            this.generateNumbers();
        }
        return this.numbers.slice(0, this.numbers.length - 1);
    }

    public getNumbers$(): Observable<number> {
        if (this.numbers.length === 0) {
            this.generateNumbers();
        }
        return timer(0, this.config.timePrinted)
            .pipe(
                take(this.actualSerieSize),
                map(i => this.numbers[i]),
            );
    }

    public getAnswer(): number {
        return this.numbers.reduce((a, b) => a + b);
    }

    private generateNumbers() {
        this.numbers.push(0);
        for (let i = 0; i < this.config.serieSize; i = i + 1) {
            this.numbers.push(Math.floor(Math.random() * -2 * this.config.range) + this.config.range + 1);
        }
        this.numbers.push(0);
    }
}
