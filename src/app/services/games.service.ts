import { inject, Injectable } from '@angular/core';
import { collection, collectionData, doc, docData, Firestore, getCountFromServer, query, where } from '@angular/fire/firestore';
import { filter, map, Observable, switchMap, tap } from 'rxjs';
import { AuthService } from './auth-service';
import { Functions, httpsCallable } from '@angular/fire/functions';
import { UserGame } from '../model/game/user-game';
import { GameLevel } from '../model/game/game-level';

@Injectable({
  providedIn: 'root'
})
export class GamesService {

  private authService = inject(AuthService);
  private firestore = inject(Firestore);
  private cloudFunctions = inject(Functions)

  getUserGame$(gameId: string): Observable<UserGame> {
    // check if user is log ?
    return this.authService.getUserId$().pipe(
      switchMap(userId => {
        if (!userId) {
          return;
        }
        return docData(doc(this.firestore, `users/${userId}/usergames/${gameId}`))
      }),
    );
  }

  getLevelContent(game_id: string, level_id: string): Promise<GameLevel> {
    interface Body {
      game_id: string
      level_id: string
    }

    return httpsCallable<Body, GameLevel>(this.cloudFunctions, 'GetLevelContent')({ game_id, level_id })
      .then((res) => {
        console.log('level', res);
        return res.data
      })
  }

  getGamesSearching$(): Observable<number> {
    return this.authService.getUserId$().pipe(
      map(userId => {
        if (!userId) {
          return null;
        }
        return query(collection(this.firestore, `users/${userId}/usergames`), where('status', '==', 'searching'))
      }),
      filter(q => !!q),
      switchMap(q => getCountFromServer(q)),
      map(q => q.data().count),
    );
  }

  getGamesReady$(): Observable<UserGame[]> {
    return this.authService.getUserId$().pipe(
      switchMap(userId => {
        if (!userId) {
          return [];
        }
        return collectionData(query(collection(this.firestore, `users/${userId}/usergames`), where('status', '==', 'playing')))
      }),
    );
  }

  waitForOpponent(): Promise<string> {
    return httpsCallable<{}, { game_id: string }>(this.cloudFunctions, 'WaitForOpponent')()
      .then((res) => res.data.game_id)
  }

  answerLevel(game_id: string, level_id: string, answer: number): Promise<boolean> {
    interface Body {
      game_id: string
      level_id: string
      answer: number
    }

    return httpsCallable<Body, { correct: boolean, correct_answer: number }>(this.cloudFunctions, 'UserLevelAnswer')({ game_id, level_id, answer })
      .then((res) => res.data?.correct)
  }
}
