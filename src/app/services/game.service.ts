import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Game } from '../model/game.class';
import { GameConfig } from '../model/game-config.interface';
import { GameDifficulty, timeToPrintFromDifficulty } from '../model/game-difficulty.enum';
import { HttpClient } from '@angular/common/http';
import { AccountService } from './account.service';
import { AuthService } from './auth.service';
import { map, switchMap, take } from 'rxjs/operators';
import { UtilsService } from './utils.service';

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
        private storage: Storage,
        private http: HttpClient,
        private authService: AuthService,
        private utilsService: UtilsService,
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

    waitForOpponent(): Promise<void> {
        // TODO Add a helper authenticatedQuery
        return this.authService.getAuthToken$()
            .then(token => this.authService.getUserId$().pipe(
                take(1),
                switchMap(userId => this.http.post<{ data: { game_id: string } }>(
                    'https://europe-west1-calculis.cloudfunctions.net/WaitForOpponent',
                    { 'user_id': userId },
                    { headers: { 'Authorization': `Bearer ${token}` } },
                )),
                map(res => res.data.game_id),
            ).toPromise())
            .then(gameId => this.utilsService.showToast('user game created: ' + gameId))
            .catch(err => this.utilsService.showToast('failed: ' + JSON.stringify(err)))
    }
}
