import { Component, inject, Signal } from '@angular/core';
import { UtilsService } from '../../services/utils.service';
import { GamesService } from '../../services/games.service';
import { MatListModule } from '@angular/material/list';
import { UserGame } from '../../model/game/user-game';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-page-games',
  imports: [
    CommonModule,
    MatListModule,
    MatToolbarModule,
    RouterLink,
  ],
  templateUrl: './page-games.component.html',
  styleUrl: './page-games.component.css',
  standalone: true,
})
export class PageGamesComponent {

  gamesService = inject(GamesService)
  utilsService = inject(UtilsService)

  gamesReadyToPlay: Signal<UserGame[]>
  gamesSearching: Signal<number>

  constructor() {
    this.gamesReadyToPlay = toSignal(this.gamesService.getGamesReady$(), {initialValue: []})
    this.gamesSearching = toSignal(this.gamesService.getGamesSearching$(), {initialValue: 0})
  }
}
