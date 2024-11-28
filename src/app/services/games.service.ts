import { inject, Injectable } from '@angular/core';
import { collection, collectionData, Firestore, getCountFromServer, query, where, doc, getDoc, docData } from '@angular/fire/firestore';
import { filter, map, Observable, switchMap, tap } from 'rxjs';
import { AuthService } from './auth-service';
import { Functions, httpsCallable } from '@angular/fire/functions';
import { UserGame } from '../model/game/user-game';
import { Game } from '../model/game/game';

@Injectable({
  providedIn: 'root'
})
export class GamesService {

  private authService = inject(AuthService);
  private firestore = inject(Firestore);
  private cloudFunctions = inject(Functions)

  getCurrentGame$(gameId: string): Observable<Game> {
    // check if user is log ?
    return this.authService.getUserId$().pipe(
      switchMap(userId => {
        if (!userId) {
          return {} as Game;
        }
        return docData(query(collection(this.firestore, `games/${gameId}`)))
      }),
      tap(x => console.log('x', x))
    );
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
    return httpsCallable<{}, { data: { game_id: string } }>(this.cloudFunctions, 'WaitForOpponent')()
      .then((res) => res.data.data?.game_id)
  }
}
