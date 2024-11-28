import { Component, inject, OnInit, Signal } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { GamesService } from '../../../services/games.service';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { emptyGame, Game } from '../../../model/game/game';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-game-start',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './game-start.component.html',
  styleUrl: './game-start.component.css'
})
export class GameStartComponent {

  activatedRoute = inject(ActivatedRoute)
  gameService = inject(GamesService);

  game: Signal<Game>

  constructor() {
    this.game = toSignal(this.activatedRoute.params.pipe(
      tap(params => console.log('params', params)),
      switchMap(params => this.gameService.getCurrentGame$(params["gameId"])),
      tap(game => console.log('game', game)),
      switchMap(game => this.gameService.getGameLevel$(game.gameId, game.currentLevelId)),
      tap(level => console.log('level', level)),
    ), { initialValue: emptyGame })
  }

  answer(val: any) {
    console.log('answering', val)
    this.gameService.answerLevel(this.game().gameId, this.game().currentLevelId, val)
      .then(x => console.log('answer response', x))
  }
}
