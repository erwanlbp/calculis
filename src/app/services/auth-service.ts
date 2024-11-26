import { inject, Injectable, Signal, signal } from '@angular/core';
import { GoogleAuthProvider } from "firebase/auth";
import { Auth, signInWithPopup, user } from '@angular/fire/auth';
import { from, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private auth = inject(Auth);

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
    return from(signInWithPopup(this.auth, new GoogleAuthProvider()));
  }

  public logout(): Promise<void> {
    return this.auth.signOut();
  }

  public isConnected(): Signal<boolean> {
    return signal(user(this.auth).pipe(map(user => !!user)));
  }
}
