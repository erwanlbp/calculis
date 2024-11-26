import { CommonModule } from '@angular/common';
import { Component, inject, Signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth-service';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatSidenavModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: true,
})
export class AppComponent {
  authService: AuthService = inject(AuthService);

  title = 'calculis';

  connected: Signal<boolean>;

  constructor() {
    this.connected = toSignal(this.authService.isConnected$(), { initialValue: false })
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
