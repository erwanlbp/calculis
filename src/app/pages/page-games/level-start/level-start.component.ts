import { Component, EventEmitter, Input, OnInit, Output, signal, WritableSignal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { concatMap, from, interval, take } from 'rxjs';

@Component({
  selector: 'app-level-start',
  standalone: true,
  imports: [
    JsonPipe
  ],
  templateUrl: './level-start.component.html',
  styleUrl: './level-start.component.css'
})
export class LevelStartComponent implements OnInit {

  @Input()
  numbers: number[] = []
  @Output()
  endDisplay: EventEmitter<void> = new EventEmitter();

  currentNumber: WritableSignal<number> = signal(0);

  constructor() {
  }

  ngOnInit() {
    from(this.numbers)
      .pipe(
        concatMap((num, index) => {
            this.currentNumber.set(num);
            return interval(1000).pipe(take(1));
          }
        )
      )
      .subscribe({
        complete: () => this.endDisplay.emit()
      })
  }

}
