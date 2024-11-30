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
import { Messaging, onMessage } from '@angular/fire/messaging';
import { Observable, tap } from 'rxjs';
import { MessagingService } from './services/messaging.service';


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

  menuItems = [
    { link: '/home', icon: 'home', label: 'Home', },
    { link: '/games', icon: '123', label: 'Games', },
    { link: '/account', icon: 'person', label: 'Account', },
  ]

  connected: Signal<boolean>;
  messaging = inject(Messaging)


  constructor() {
    this.connected = toSignal(this.authService.isConnected$(), { initialValue: false })

    new Observable((sub) => onMessage(this.messaging, (msg) =>
      sub.next(msg))).pipe(
        tap((msg) => {
          console.log("My Firebase Cloud Message", msg);
        })
      );
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
