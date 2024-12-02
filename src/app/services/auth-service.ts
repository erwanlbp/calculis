import { inject, Injectable, Signal, signal } from '@angular/core';
import { GoogleAuthProvider } from "firebase/auth";
import { Auth, authState, signInWithPopup, user } from '@angular/fire/auth';
import { firstValueFrom, from, map, Observable, switchMap } from 'rxjs';
import { doc, Firestore, setDoc, updateDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private auth = inject(Auth);
  private firestore = inject(Firestore);

  public storeFCMToken(token: string): Promise<void> {
    return firstValueFrom(this.getUserId$().pipe(
      switchMap(userId => updateDoc(doc(this.firestore, `users/${userId}`), { fcmToken: token })
        .catch(err => setDoc(doc(this.firestore, `users/${userId}`), { fcmToken: token }))),
    ))
  }

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
