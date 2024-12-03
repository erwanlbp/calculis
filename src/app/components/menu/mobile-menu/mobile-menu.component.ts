import { Component, inject, Signal } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { NgForOf, NgIf } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MENU_ITEMS } from '../menu';
import { MatTooltip } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UtilsService } from '../../../services/utils.service';
import { AuthService } from '../../../services/auth-service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-mobile-menu',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    RouterLink,
    RouterLinkActive,
    MatTooltip,
    MatListModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './mobile-menu.component.html',
  styleUrl: './mobile-menu.component.css'
})
export class MobileMenuComponent {

  menuItems = MENU_ITEMS;

  private authService = inject(AuthService);
  connected: Signal<boolean>


  constructor() {
    this.connected = toSignal(this.authService.isConnected$(), { initialValue: false })
  }

  login() {
    this.authService.login()
  }
}
