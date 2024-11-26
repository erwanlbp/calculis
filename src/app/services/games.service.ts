import { inject, Injectable } from '@angular/core';
import { collection, Firestore, where, query, getCountFromServer, docSnapshots, collectionData } from '@angular/fire/firestore';
import { filter, firstValueFrom, map, Observable, switchMap, tap } from 'rxjs';
import { AuthService } from './auth-service';
import { UserGame } from '../model/game.model';

@Injectable({
  providedIn: 'root'
})
export class GamesService {

  private authService = inject(AuthService);
  private firestore = inject(Firestore);

  getGamesSearching$(): Observable<number> {
    let res = this.authService.getUserId$().pipe(
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
    return res;
  }

  getGamesReady$(): Observable<UserGame[]> {
    return this.authService.getUserId$().pipe(
      switchMap(userId => {
        if (!userId) {
          return null;
        }
        return collectionData(query(collection(this.firestore, `users/${userId}/usergames`), where('status', '==', 'playing')))
      }),
      tap(x => console.log('x',x)),
    );
  }
}
