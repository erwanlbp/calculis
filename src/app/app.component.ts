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
import { MobileMenuComponent } from './components/menu/mobile-menu/mobile-menu.component';
import { MENU_ITEMS } from './components/menu/menu';


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
    MobileMenuComponent,
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

  connected: Signal<boolean>;
  messaging = inject(Messaging)
  isMobile: Signal<boolean>
  menuItems = MENU_ITEMS;

  constructor() {
    this.connected = toSignal(this.authService.isConnected$(), { initialValue: false })
    this.isMobile = this.utilsService.isMobile()

    onMessage(this.messaging, (message: MessagePayload) => {
      console.log("My Firebase Cloud Message", message);
      if (message && message.data && message.data['type'] == 'game_created') {
        this.utilsService.showToast(`La game ${message.data['gameId']} est prete à jouer !`)
      } else {
        console.log('received notif', message)
      }
    })
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
