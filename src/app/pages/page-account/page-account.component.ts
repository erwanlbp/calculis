import { ExternalExpr } from '@angular/compiler';
import { Component, inject } from '@angular/core';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'app-page-account',
  imports: [],
  templateUrl: './page-account.component.html',
  styleUrl: './page-account.component.css',
  standalone: true,
})
export class PageAccountComponent {

  accountService = inject(AccountService)

  deleteAccount() {
    this.accountService.deleteAccount();
  }
}
