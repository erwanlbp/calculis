import { Component, Input, OnInit } from '@angular/core';
import { interval, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Component({
    selector: 'app-game-sequence',
    templateUrl: './game-sequence.component.html',
    styleUrls: ['./game-sequence.component.scss'],
})
export class GameSequenceComponent implements OnInit {

    @Input() number$: Observable<number>;
    @Input() timePrinted: number;

    progress$: Observable<number>;

    private progressTick = 30;

    constructor() {
    }

    ngOnInit() {
        if (this.timePrinted) {
            this.progress$ = this.number$.pipe(
                switchMap(() => interval(this.progressTick)),
                map(i => 1 - (i / (this.timePrinted / this.progressTick))),
            );
        }
    }
}
