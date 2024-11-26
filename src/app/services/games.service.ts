import { inject, Injectable } from '@angular/core';
import { collection, collectionData, Firestore, getCountFromServer, query, where } from '@angular/fire/firestore';
import { filter, map, Observable, switchMap, tap } from 'rxjs';
import { AuthService } from './auth-service';
import { UserGame } from '../model/game.model';

@Injectable({
  providedIn: 'root'
})
export class GamesService {

  private authService = inject(AuthService);
  private firestore = inject(Firestore);

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
          return null;
        }
        return collectionData(query(collection(this.firestore, `users/${userId}/usergames`), where('status', '==', 'playing')))
      }),
      tap(x => console.log('x', x)),
    );
  }
}
