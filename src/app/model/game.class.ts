import { GameConfig } from './game-config.interface';
import { Observable, of, from, timer, interval } from 'rxjs';
import { map, take, tap, startWith, endWith } from 'rxjs/operators';

export class Game {

    private numbers: number[] = [];
    public config: GameConfig;
    private actualSerieSize: number;

    constructor(config: GameConfig) {
        this.config = config;
        console.log('game config:', this.config);
        this.actualSerieSize = config.serieSize + 2;
    }

    public getNumbers$(): Observable<number> {
        if (this.numbers.length === 0) {
            this.generateNumbers();
        }
        console.log('game numbers:', this.numbers);
        return interval(this.config.timePrinted)
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
            this.numbers.push(Math.floor(Math.random() * (this.config.rangeMin - this.config.rangeMax)) + this.config.rangeMax + 1);
        }
        this.numbers.push(0);
    }
}
