import { inject, Injectable } from '@angular/core';
import { getToken, Messaging, onMessage } from '@angular/fire/messaging';
import { EMPTY, firstValueFrom, from, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from '../services/auth-service';
import { FirebaseNotification } from '../model/message';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root'
})
export class MessagingService {
  message$: Observable<any> = EMPTY;

  messaging = inject(Messaging)
  authService = inject(AuthService)
  utilsService = inject(UtilsService)

  constructor() {
    getToken(this.messaging, { vapidKey: environment.firebaseConfig.vapidKey, })
      .then(token => {
        console.log('FCM token', { token });
        return this.authService.storeFCMToken(token);
      })

    this.message$ = new Observable(sub => onMessage(this.messaging, it => sub.next(it))).pipe(
      tap((message: any) => this.handleMessage(message)),
    );
  }

  ngOnInit(): void {
  }

  request() {
    Notification.requestPermission();
  }

  handleMessage(message: FirebaseNotification) {
    if (message.data.type == 'game_created') {
      this.utilsService.showToast(`La game ${message.data.gameId} est prete à jouer !`)
    } else {
      console.log('received notif', message)
    }
  }
}
