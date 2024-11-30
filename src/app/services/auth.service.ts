import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Auth, authState, GoogleAuthProvider, signInWithCredential, signInWithPopup, user, UserCredential } from '@angular/fire/auth';
import { map, take } from 'rxjs/operators';
import { Platform } from '@ionic/angular';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { firebaseWebClientId } from 'src/environments/firebase.config';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(
        private fireAuth: Auth,
        private platform: Platform,
        private google: GooglePlus,
    ) {
    }

    isConnected$(): Observable<boolean> {
        return user(this.fireAuth).pipe(map(user => !!user));
    }

    getAuthToken$(): Promise<string> {
        return authState(this.fireAuth).pipe(take(1)).toPromise()
            .then(user => user ? user.getIdToken() : null);
    }

    getUserId$(): Observable<string> {
        return authState(this.fireAuth).pipe(map(user => user ? user.uid : null));
    }

    getUserEmail$() {
        return user(this.fireAuth).pipe(map(user => user ? user.email : null));
    }

    login() {
        if (this.platform.is('cordova')) {
            return this.mobileLogin();
        } else {
            return this.webLogin();
        }
    }

    mobileLogin(): Promise<UserCredential> {
        let params;
        if (this.platform.is('android')) {
            params = { webClientId: firebaseWebClientId, offline: true };
        } else {
            params = {};
        }
        return this.google.login(params)
            .then((response) => {
                const { idToken, accessToken } = response;
                return this.onLoginSuccess(idToken, accessToken);
            });
    }

    webLogin(): Promise<UserCredential> {
        return signInWithPopup(this.fireAuth, new GoogleAuthProvider());
    }

    onLoginSuccess(accessToken, accessSecret): Promise<UserCredential> {
        const credential = accessSecret ?
            GoogleAuthProvider.credential(accessToken, accessSecret)
            : GoogleAuthProvider.credential(accessToken);
        return signInWithCredential(this.fireAuth, credential);
    }

    logout(): Promise<void> {
        return this.fireAuth.signOut();
    }
}
