import { inject, Injectable } from '@angular/core';
import { deleteDoc, doc, Firestore } from '@angular/fire/firestore';
import { filter, firstValueFrom, map, take } from 'rxjs';
import { AuthService } from './auth-service';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private authService = inject(AuthService);
  private firestore = inject(Firestore);
  private utilsService = inject(UtilsService);

  deleteAccount(): Promise<void> {
    return firstValueFrom(this.authService.getUserId$().pipe(
      take(1),
      map(userId => {
        if (!userId) {
          return null;
        }
        return doc(this.firestore, `users/${userId}`)
      }),
      filter(doc => !!doc)
    ))
      .then(doc => deleteDoc(doc))
      .then(() => this.utilsService.showToast('Compte supprimé'))
      .then(() => this.authService.logout())
      .catch(err => this.utilsService.showToast('Echec'));
  }
}
