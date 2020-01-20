import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Game } from '../model/game.class';

@Injectable({
    providedIn: 'root'
})
export class GameService {

    private currentLevel: number;

    private rangeEvolutionFn = (lvl: number) => Math.floor(lvl * 0.20) + 5;
    private serieSizeEvolutionFn = (lvl: number) => Math.floor(lvl * 0.25) + 3;
    private timePrintedEvolutionFn = (lvl: number) => Math.ceil(-1 * lvl * 0.25) + 2000;

    constructor(
        private storage: Storage
    ) {
    }

    private generateGame(): Game {
        return new Game({
            rangeMin: -1 * this.rangeEvolutionFn(this.currentLevel),
            rangeMax: this.rangeEvolutionFn(this.currentLevel),
            serieSize: this.serieSizeEvolutionFn(this.currentLevel),
            timePrinted: this.timePrintedEvolutionFn(this.currentLevel),
        });
    }

    nextGameLevel(): Game {
        this.currentLevel++;
        return this.generateGame();
    }

    newGame(): Game {
        this.currentLevel = 1;
        return this.generateGame();
    }

    getCurrentLevel(): number {
        return this.currentLevel;
    }
}
