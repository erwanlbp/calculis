import { Component, Input, signal, WritableSignal } from '@angular/core';
import { delay, map, mergeAll, of } from 'rxjs';

@Component({
  selector: 'app-level-start',
  standalone: true,
  imports: [],
  templateUrl: './level-start.component.html',
  styleUrl: './level-start.component.css'
})
export class LevelStartComponent {

  @Input()
  numbers: number[] = []

  currentNumber: WritableSignal<number> = signal(0)

  constructor() {
    of([...this.numbers]).pipe(
      mergeAll(),
      map(n => this.currentNumber.set(n)),
      delay(1000)
    ).subscribe()
  }

}
