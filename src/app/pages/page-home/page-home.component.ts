import { CommonModule } from '@angular/common';
import { Component, inject, Signal } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthService } from '../../services/auth-service';
import { toSignal } from '@angular/core/rxjs-interop';
import { GamesService } from '../../services/games.service';
import { UtilsService } from '../../services/utils.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-page-home',
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
  ],
  templateUrl: './page-home.component.html',
  styleUrl: './page-home.component.css',
  standalone: true,
})
export class PageHomeComponent {

  private authService = inject(AuthService)
  private utilsService = inject(UtilsService)
  private gameService = inject(GamesService)

  connected: Signal<boolean>

  constructor() {
    this.connected = toSignal(this.authService.isConnected$(), { initialValue: false });
  }

  waitForOpponent() {
    this.gameService.waitForOpponent()
      .then(gameId => this.utilsService.showToast('Game créée: ' + gameId))
      .catch(err => this.utilsService.showToast('Echec: ' + err))
  }
}
