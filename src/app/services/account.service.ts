import { inject, Injectable, Signal, signal } from '@angular/core';
import { GoogleAuthProvider } from "firebase/auth";
import { Auth, signInWithPopup, user } from '@angular/fire/auth';
import { from, map, Observable, take } from 'rxjs';
import { AuthService } from './auth-service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private authService = inject(AuthService);

  deleteAccount(): Promise<void> {
    return this.authService.getUserId$().pipe(
        take(1),
        map(userId => {
            if (!userId) {
                return null;
            }
            return doc(this.firestore,`users/${userId}`)
        }),
    ).toPromise()
        .then(doc => deleteDoc(doc))
        .then(() => this.utilsService.showToast('Compte supprimé'))
        .then(() => this.authService.logout())
        .catch(err => this.utilsService.showToast('Echec'));
}
}
