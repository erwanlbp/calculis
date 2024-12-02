import { Component, inject, Signal } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth-service';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';

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

  accountService = inject(AccountService)
  authService = inject(AuthService)

  email: Signal<string>;
  connected: Signal<boolean>;

  constructor() {
    this.email = toSignal(this.authService.getUserEmail$(), { initialValue: '' });
    this.connected = toSignal(this.authService.isConnected$(), { initialValue: false })
  }

  deleteAccount() {
    this.accountService.deleteAccount();
  }

  askConfirm(): boolean {
    return confirm('Confirmer ?')
  }
}
