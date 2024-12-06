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
    NgIf,
    JsonPipe,
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

  currentNumber: WritableSignal<number | undefined> = signal(undefined);
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

    this.currentNumber$.subscribe({
      next: x => {
        this.isOdd = !this.isOdd;
        console.log('n', x)
      },
      complete: () => this.endDisplay.emit()
    })

    //     switchMap(() => timer(0, goDurationToMs(this.level.config.printedDuration) + 30)),
    //     tap(i => console.log('i', i)),
    //     take(this.level.config.serieSize),
    //     map(i => this.level.numbers.numbers[i]),
    //     share(),

    // this.currentNumber$ = number$.pipe(
    //   tap(x => console.log('n', x)),
    //   tap(() => this.currentNumber.set( undefined)),
    //   delay(30),
    // );

    // number$.subscribe({ complete: () => this.endDisplay.emit() });

    // this.progress$ = number$.pipe(
    //   tap(x => console.log('p', x)),
    //   tap(() => this.isOdd = !this.isOdd),
    //   switchMap(() => interval(30)),
    //   map(i => {
    //     const val = i / (goDurationToMs(this.level.config.printedDuration) / 30);
    //     return this.isOdd ? val : 1 - val;
    //   }),
    // );
  }

  private createCurrentNumberObservable(level$: Observable<GameLevel>): Observable<number> {
    return level$.pipe(
      switchMap(level => {
        const printedDuration = goDurationToMs(level.config.printedDuration);
        return interval(printedDuration).pipe(
          take(level.config.serieSize),
          map(index => level.numbers.numbers[index])
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
          })
        );
      })
    );
  }
}
