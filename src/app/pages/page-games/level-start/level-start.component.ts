import { Component, EventEmitter, Input, OnInit, Output, signal, WritableSignal } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { concatMap, delay, EMPTY, from, interval, map, Observable, switchMap, take, tap } from 'rxjs';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-level-start',
  standalone: true,
  imports: [
    MatProgressBarModule,
    AsyncPipe
  ],
  templateUrl: './level-start.component.html',
  styleUrl: './level-start.component.css'
})
export class LevelStartComponent implements OnInit {

  @Input()
  numbers: number[] = []
  @Output() endDisplay: EventEmitter<void> = new EventEmitter();

  currentNumber: WritableSignal<number | null> = signal(null);

  progress: WritableSignal<number> = signal(0);
  isOdd: boolean = true;

  constructor() { }

  ngOnInit() {
    from(this.numbers).pipe(
      take(this.numbers.length),
      tap(() => this.currentNumber.set(null)),
      delay(1000),
      map(n => {
        this.currentNumber.set(n)
        console.log('current',n)
  }),
    ).subscribe({
      complete: () => {
        console.log('complete')
        this.endDisplay.emit()
      }
    })

    // concatMap((num, index) => {
    //   this.currentNumber.set(num);
    //   return interval(1000).pipe(take(1), map(() => index));
    // }),
    //   tap(() => this.isOdd = !this.isOdd),
    //   map(i => {
    //     const val = i / (1000 / 30) * 100;
    //     console.log(i, val)
    //     return val;
    //   }),
    // )
    //   .subscribe({
    //     next: v => this.progress.set(v),
    //     complete: () => this.endDisplay.emit()
    //   })
  }
}
