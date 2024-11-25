import { Injectable } from '@angular/core';
import { GameConfig } from '../model/game-config.interface';
import { Observable, of } from 'rxjs';
import { UserGame } from '../model/user-game.class';

@Injectable({
    providedIn: 'root'
})
export class GamesHistoryService {

    private currentLevel: number;

    private defaultConfig: GameConfig = {
        timePrinted: null,
        range: 5,
        serieSize: 3,
    };

    constructor(
    ) {
    }

    fetchUserGamesHistory$(): Observable<UserGame[]> {
        return of([])
    }
}
