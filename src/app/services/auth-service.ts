import { inject, Injectable, Signal, signal } from '@angular/core';
import { GoogleAuthProvider } from "firebase/auth";
import { Auth, authState, signInWithPopup, user } from '@angular/fire/auth';
import { firstValueFrom, from, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private auth = inject(Auth);

  public getAuthToken(): Promise<string> {
    return firstValueFrom(authState(this.auth))
      .then((user: any) => user ? user.getIdToken() : null);
  }

  public getUserId$(): Observable<string> {
    return authState(this.auth).pipe(map((user: any) => user ? user.uid : null));
  }

  getUserEmail$() {
    return user(this.auth).pipe(map((user: any) => user ? user.email : null));
  }

  public login() {
    return this.webLogin();
  }

  private webLogin() {
    return from(signInWithPopup(this.auth, new GoogleAuthProvider()));
  }

  public logout(): Promise<void> {
    return this.auth.signOut();
  }

  public isConnected$(): Observable<boolean> {
    return user(this.auth).pipe(map(user => !!user));
  }
}
