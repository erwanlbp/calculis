import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Game } from '../model/game.class';
import { GameConfig } from '../model/game-config.interface';
import { GameDifficulty, timeToPrintFromDifficulty } from '../model/game-difficulty.enum';

@Injectable({
    providedIn: 'root'
})
export class GameService {

    private currentLevel: number;

    private defaultConfig: GameConfig = {
        timePrinted: null,
        range: 5,
        serieSize: 3,
    };

    private rangeEvolutionFn = (lvl: number) => Math.floor(lvl / 5) + this.defaultConfig.range;
    private serieSizeEvolutionFn = (lvl: number) => Math.floor(lvl / 4) + this.defaultConfig.serieSize;
    private timePrintedEvolutionFn = (difficulty: GameDifficulty) => timeToPrintFromDifficulty(difficulty);

    constructor(
        private storage: Storage
    ) {
    }

    private generateGame(difficulty: GameDifficulty): Game {
        return new Game(
            difficulty,
            this.currentLevel,
            {
                range: this.rangeEvolutionFn(this.currentLevel),
                serieSize: this.serieSizeEvolutionFn(this.currentLevel),
                timePrinted: this.timePrintedEvolutionFn(difficulty),
            }
        );
    }

    nextGameLevel(difficulty: GameDifficulty): Game {
        this.currentLevel++;
        return this.generateGame(difficulty);
    }

    newGame(difficulty: GameDifficulty, defaultLevel: number = 1): Game {
        this.currentLevel = defaultLevel;
        return this.generateGame(difficulty);
    }
}
