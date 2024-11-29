import { Component, Input, signal, WritableSignal } from '@angular/core';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-level-start',
  standalone: true,
  imports: [
    JsonPipe
  ],
  templateUrl: './level-start.component.html',
  styleUrl: './level-start.component.css'
})
export class LevelStartComponent {

  @Input()
  numbers: number[] = []

  currentNumber: WritableSignal<number> = signal(0)

  constructor() {
    // from(this.numbers).pipe(
    //   map(r => r),
    //   delay(1000),
    //   tap(n => this.currentNumber.set(n))
    // ).subscribe();
  }
}
