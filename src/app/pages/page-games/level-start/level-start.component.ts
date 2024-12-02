import { Component, computed, EventEmitter, inject, Input, OnInit, Output, Signal, signal, WritableSignal } from '@angular/core';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { catchError, concatMap, EMPTY, filter, from, interval, map, Observable, Subject, switchMap, take, tap } from 'rxjs';
import { emptyLevel, GameLevel } from '../../../model/game/game-level';
import { toSignal } from '@angular/core/rxjs-interop';
import { GamesService } from '../../../services/games.service';
import { emptyUserGame, UserGame } from '../../../model/game/user-game';
import { UtilsService } from '../../../services/utils.service';

@Component({
  selector: 'app-level-start',
  standalone: true,
  imports: [
    JsonPipe, AsyncPipe,
  ],
  templateUrl: './level-start.component.html',
  styleUrl: './level-start.component.css'
})
export class LevelStartComponent implements OnInit {

  @Input() game!: UserGame;

  @Output() endDisplay: EventEmitter<void> = new EventEmitter();

  private gameService = inject(GamesService)
  private utilsService = inject(UtilsService)

  level: Observable<GameLevel> = EMPTY

  currentNumber: WritableSignal<number> = signal(0);

  constructor() {
  }

  ngOnInit() {
    this.level = from(this.gameService.getLevelContent(this.game.gameId, this.game.currentLevelId))
      .pipe(
        catchError((err) => {
          this.utilsService.showToast('Le niveau a déjà été joué !');
          return EMPTY;
        }),
        filter(level => !!level),
      );
    this.level.pipe(
      filter(level => !!level),
      switchMap(level => from(level.numbers.numbers)),
      concatMap((num, index) => {
        this.currentNumber.set(num);
        return interval(1000).pipe(take(1));
      })
    ).subscribe({
      complete: () => this.endDisplay.emit()
    })
  }

}
