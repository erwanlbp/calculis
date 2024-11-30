import { CommonModule } from '@angular/common';
import { Component, inject, Signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth-service';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MessagePayload, Messaging, onMessage } from '@angular/fire/messaging';
import { MessagingService } from './services/messaging.service';
import { UtilsService } from './services/utils.service';


@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatSidenavModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: true,
})
export class AppComponent {
  authService: AuthService = inject(AuthService);

  title = 'calculis';

  messagingComponent = inject(MessagingService)
  utilsService = inject(UtilsService)

  menuItems = [
    { link: '/home', icon: 'home', label: 'Home', },
    { link: '/games', icon: '123', label: 'Games', },
    { link: '/account', icon: 'person', label: 'Account', },
  ]

  connected: Signal<boolean>;
  messaging = inject(Messaging)

  messageHandler(message: MessagePayload): void {
    console.log("My Firebase Cloud Message", message);
    if (message && message.data && message.data['type'] == 'game_created') {
      this.utilsService.showToast(`La game ${message.data['gameId']} est prete à jouer !`)
    } else {
      console.log('received notif', message)
    }
  }

  constructor() {
    this.connected = toSignal(this.authService.isConnected$(), { initialValue: false })

    console.log('starting onMessage')
    onMessage(this.messaging, this.messageHandler)
  }

  login() {
    this.authService.login().subscribe(r => {
      console.log(r)
    });
  }

  logout() {
    this.authService.logout();
  }
}
