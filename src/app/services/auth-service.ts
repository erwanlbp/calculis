import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { GoogleAuthProvider } from "firebase/auth";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private fireAuth: AngularFireAuth) {
  }

  // old
  // public isConnected(): Observable<boolean> {
  //   return this.fireAuth.user.pipe(map(user => !!user));
  // }
  //
  // public getAuthToken(): Promise<string> {
  //   return this.fireAuth.authState.pipe(take(1)).toPromise()
  //     .then(user => user ? user.getIdToken() : null);
  // }
  //
  // public getUserId(): Observable<string> {
  //   return this.fireAuth.authState.pipe(map(user => user ? user.uid : null));
  // }
  //
  // public getUserEmail() {
  //   return this.fireAuth.user.pipe(map(user => user ? user.email : null));
  // }

  public login() {
    return this.webLogin();
  }

  private webLogin() {
    return this.fireAuth.signInWithPopup(new GoogleAuthProvider());
  }

  public logout(): Promise<void> {
    return this.fireAuth.signOut();
  }
}
