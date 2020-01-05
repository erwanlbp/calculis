import { Component, OnInit, Input } from '@angular/core';
import { Observable, interval } from 'rxjs';
import { map, take, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-game-sequence',
  templateUrl: './game-sequence.component.html',
  styleUrls: ['./game-sequence.component.scss'],
})
export class GameSequenceComponent implements OnInit {

  @Input() number$: Observable<number>;
  @Input() timePrinted: number;

  progress$: Observable<number>;

  private progressTick = 10;

  constructor() { }

  ngOnInit() {
    if (this.timePrinted) {
      this.progress$ = this.number$.pipe(
        switchMap(() => interval(this.progressTick)),
        map(i => 1 - (i / (this.timePrinted / this.progressTick))),
      );
    }
  }
}
