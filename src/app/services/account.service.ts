import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { deleteDoc, doc, Firestore, getDoc, setDoc } from '@angular/fire/firestore';
import { UtilsService } from './utils.service';
import { map, take } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AccountService {

    constructor(
        private firestore: Firestore,
        private authService: AuthService,
        private utilsService: UtilsService,
    ) {
    }

    updateAccountEmail(email: string): Promise<void> {
        return this.authService.getUserId$().pipe(
            take(1),
            map(userId => doc(this.firestore, `users/${userId}`))
        ).toPromise()
            .then(doc => setDoc(doc,{ email }));
    }

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
