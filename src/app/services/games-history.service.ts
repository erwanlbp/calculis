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
import { Observable, of } from 'rxjs';
import { UserGame } from '../model/user-game.class';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

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

    private rangeEvolutionFn = (lvl: number) => Math.floor(lvl / 5) + this.defaultConfig.range;
    private serieSizeEvolutionFn = (lvl: number) => Math.floor(lvl / 4) + this.defaultConfig.serieSize;
    private timePrintedEvolutionFn = (difficulty: GameDifficulty) => timeToPrintFromDifficulty(difficulty);

    constructor(
        private firestore: AngularFirestore,
        private storage: Storage,
        private http: HttpClient,
        private authService: AuthService,
        private utilsService: UtilsService,
    ) {
    }

    private userScoresCollection$(): Observable<AngularFirestoreCollection<UserGame>> {
        return this.authService.getUserId$().pipe(
            map(userId => {
                if (!userId) {
                    return null;
                }
                return this.firestore.collection<UserGame>(`users/${userId}/usergames`);
            })
        );
    }

    fetchUserGamesHistory$(): Observable<UserGame[]> {
        return this.userScoresCollection$().pipe(
            switchMap(col => {
                if (!col) {
                    return of([] as UserGame[]);
                }
                return col.valueChanges();
            }),
        );
    }
}
