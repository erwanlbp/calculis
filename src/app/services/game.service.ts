import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Game } from '../model/game.class';
import { GameConfig } from '../model/game-config.interface';

@Injectable({
    providedIn: 'root'
})
export class GameService {

    private currentLevel: number;

    private defaultConfig: GameConfig = {
        timePrinted: 2000,
        range: 5,
        serieSize: 3,
    };

    private rangeEvolutionFn = (lvl: number) => Math.floor(lvl * 0.40) + this.defaultConfig.range;
    private serieSizeEvolutionFn = (lvl: number) => Math.floor(lvl * 0.350) + this.defaultConfig.serieSize;
    private timePrintedEvolutionFn = (lvl: number) => Math.ceil(-1 * lvl * 0.35) + this.defaultConfig.timePrinted;

    constructor(
        private storage: Storage
    ) {
    }

    getDefaultConfig(): GameConfig {
        return this.defaultConfig;
    }

    private generateGame(): Game {
        return new Game(
            this.currentLevel,
            {
                range: this.rangeEvolutionFn(this.currentLevel),
                serieSize: this.serieSizeEvolutionFn(this.currentLevel),
                timePrinted: this.timePrintedEvolutionFn(this.currentLevel),
            }
        );
    }

    nextGameLevel(): Game {
        this.currentLevel++;
        return this.generateGame();
    }

    newGame(): Game {
        this.currentLevel = 1;
        return this.generateGame();
    }
}
