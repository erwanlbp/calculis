import { Component, inject, signal, Signal, WritableSignal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GamesService } from '../../../services/games.service';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { filter, switchMap } from 'rxjs';
import { GameState, UserGameState } from '../../../model/game/game-state';
import { LevelEndComponent } from '../level-end/level-end.component';
import { LevelStartComponent } from '../level-start/level-start.component';
import { emptyLevel, GameLevel } from '../../../model/game/game-level';
import { emptyUserGame, UserGame } from '../../../model/game/user-game';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-game-start',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    LevelEndComponent,
    LevelStartComponent
  ],
  templateUrl: './game-details.component.html',
  styleUrl: './game-details.component.css'
})
export class GameDetailsComponent {

  activatedRoute = inject(ActivatedRoute)
  gameService = inject(GamesService);

  gameStateType = GameState
  userGameStateType = UserGameState
  gameState: WritableSignal<GameState>
  game: Signal<UserGame>
  currentLevel: Signal<GameLevel>

  constructor() {
    this.game = toSignal(
      this.activatedRoute.params.pipe(
        switchMap(params => this.gameService.getCurrentGame$(params["gameId"])),
      ), {initialValue: emptyUserGame}
    )

    this.currentLevel = toSignal(
      toObservable(this.game).pipe(
        filter(t => t.gameId !== 'unknown'),
        switchMap(userGame => {
          return this.gameService.getGameLevel$(userGame.gameId, userGame.currentLevelId)
        }),
      ), {initialValue: emptyLevel}
    )

    this.gameState = signal(GameState.READY);
  }

  updateGameState(gameState: GameState) {
    this.gameState.set(gameState)
  }
}
