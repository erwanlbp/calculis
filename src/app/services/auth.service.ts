import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { map } from 'rxjs/operators';
import { Platform } from '@ionic/angular';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { firebaseWebClientId } from 'src/environments/firebase.config';
import * as firebase from 'firebase/app';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(
        private fireAuth: AngularFireAuth,
        private platform: Platform,
        private google: GooglePlus,
    ) {
    }

    isConnected$(): Observable<boolean> {
        return this.fireAuth.user.pipe(map(user => !!user));
    }

    getUserId$(): Observable<string> {
        return this.fireAuth.authState.pipe(map(user => user ? user.uid : null));
    }

    getUserEmail$() {
        return this.fireAuth.user.pipe(map(user => user ? user.email : null));
    }

    login() {
        if (this.platform.is('cordova')) {
            return this.mobileLogin();
        } else {
            return this.webLogin();
        }
    }

    mobileLogin(): Promise<firebase.auth.UserCredential> {
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

    webLogin(): Promise<firebase.auth.UserCredential> {
        return this.fireAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    }

    onLoginSuccess(accessToken, accessSecret): Promise<firebase.auth.UserCredential> {
        const credential = accessSecret ?
            firebase.auth.GoogleAuthProvider.credential(accessToken, accessSecret)
            : firebase.auth.GoogleAuthProvider.credential(accessToken);
        return this.fireAuth.auth.signInWithCredential(credential);
    }

    logout(): Promise<void> {
        return this.fireAuth.auth.signOut();
    }
}
