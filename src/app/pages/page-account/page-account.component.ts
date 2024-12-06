import { Component, inject, Signal } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth-service';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { UtilsService } from '../../services/utils.service';

@Component({
  selector: 'app-page-account',
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatToolbarModule
  ],
  templateUrl: './page-account.component.html',
  styleUrl: './page-account.component.css',
  standalone: true,
})
export class PageAccountComponent {

  private accountService = inject(AccountService)
  private authService = inject(AuthService)
  private utilsService = inject(UtilsService)

  email: Signal<string>;
  connected: Signal<boolean>;
  isMobile: Signal<boolean>;

  constructor() {
    this.email = toSignal(this.authService.getUserEmail$(), { initialValue: '' });
    this.connected = toSignal(this.authService.isConnected$(), { initialValue: false })
    this.isMobile = this.utilsService.isMobile()
  }

  deleteAccount() {
    this.accountService.deleteAccount();
  }

  logout() {
    this.authService.logout()
  }

  askConfirm(): boolean {
    return confirm('Confirmer ?')
  }
}
