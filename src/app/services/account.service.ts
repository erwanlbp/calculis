import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { UtilsService } from './utils.service';
import { map, take } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AccountService {

    constructor(
        private firestore: AngularFirestore,
        private authService: AuthService,
        private utilsService: UtilsService,
    ) {
    }

    updateAccountEmail(email: string): Promise<void> {
        return this.authService.getUserId$().pipe(
            take(1),
            map(userId => this.firestore.doc(`users/${userId}`))
        ).toPromise()
            .then(doc => doc.set({ email }));
    }

    deleteAccount(): Promise<void> {
        return this.authService.getUserId$().pipe(
            take(1),
            map(userId => {
                if (!userId) {
                    return null;
                }
                return this.firestore.doc(`users/${userId}`)
            }),
        ).toPromise()
            .then(doc => doc.delete())
            .then(() => this.utilsService.showToast('Compte supprimé'))
            .then(() => this.authService.logout())
            .catch(err => this.utilsService.showToast('Echec'));
    }
}
