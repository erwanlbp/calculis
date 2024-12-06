import { Component, EventEmitter, inject, Input, OnInit, Output, signal, WritableSignal } from '@angular/core';
import { AsyncPipe, JsonPipe, NgIf } from '@angular/common';
import { catchError, EMPTY, filter, from, interval, map, Observable, switchMap, take, tap } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { emptyLevel, GameLevel } from '../../../model/game/game-level';
import { GamesService } from '../../../services/games.service';
import { UtilsService } from '../../../services/utils.service';
import { UserGame } from '../../../model/game/user-game';
import { goDurationToMs } from '../../../utils/time';

@Component({
  selector: 'app-level-start',
  standalone: true,
  imports: [
    MatProgressSpinnerModule,
    AsyncPipe,
  ],
  templateUrl: './level-start.component.html',
  styleUrl: './level-start.component.css'
})
export class LevelStartComponent implements OnInit {

  @Input() game!: UserGame;

  @Output() endDisplay: EventEmitter<void> = new EventEmitter();

  private gameService = inject(GamesService)
  private utilsService = inject(UtilsService)

  level: GameLevel = emptyLevel

  progress$: Observable<number> = EMPTY;
  currentNumber$: Observable<number> = EMPTY;
  isOdd: boolean = true;

  constructor() { }

  ngOnInit() {
    const level$ = from(this.gameService.getLevelContent(this.game.gameId, this.game.currentLevelId))
      .pipe(
        catchError((err) => {
          this.utilsService.showToast('Le niveau a déjà été joué !');
          return EMPTY;
        }),
        filter(level => !!level),
        tap(level => this.level = level),
        tap(x => console.log('fetched level', this.level)),
      );

    this.currentNumber$ = this.createCurrentNumberObservable(level$)
    this.progress$ = this.createProgressBarObservable(this.currentNumber$)

    this.currentNumber$.subscribe({ complete: () => this.endDisplay.emit() })
  }

  private createCurrentNumberObservable(level$: Observable<GameLevel>): Observable<number> {
    return level$.pipe(
      switchMap(level => {
        const printedDuration = goDurationToMs(level.config.printedDuration);
        return interval(printedDuration).pipe(
          take(level.numbers.numbers.length),
          map(index => level.numbers.numbers[index]),
          tap(() => this.isOdd = !this.isOdd)
        );
      })
    );
  }

  private createProgressBarObservable(number: Observable<number>,): Observable<number> {
    return number.pipe(
      switchMap(() => {
        const printedDuration = goDurationToMs(this.level.config.printedDuration);
        return interval(30).pipe(
          take(printedDuration / 30),
          map(tick => {
            const val = (tick * 30) / printedDuration * 100
            return this.isOdd ? val : 100 - val
          }),
        );
      })
    );
  }
}
