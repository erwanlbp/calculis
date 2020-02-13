import { Component, Input, OnInit } from '@angular/core';
import { interval, Observable } from 'rxjs';
import { delay, map, switchMap, tap } from 'rxjs/operators';
import { GameConstant } from '../../../constants/game.constants';

@Component({
    selector: 'app-game-sequence',
    templateUrl: './game-sequence.component.html',
    styleUrls: ['./game-sequence.component.scss'],
})
export class GameSequenceComponent implements OnInit {

    @Input() number$: Observable<number>;
    @Input() timePrinted: number;

    number: number;
    progress$: Observable<number>;
    isOdd: boolean = true;

    constructor() {
    }

    ngOnInit() {
        if (this.timePrinted) {
            this.number$.pipe(
                tap(() => this.number = null),
                delay(GameConstant.DELAY_BETWEEN_NUMBERS),
            ).subscribe(n => this.number = n);
            this.progress$ = this.number$.pipe(
                tap(() => this.isOdd = !this.isOdd),
                switchMap(() => interval(GameConstant.PROGRESS_TICK)),
                map(i => {
                    const val = i / (this.timePrinted / GameConstant.PROGRESS_TICK);
                    return this.isOdd ? val : 1 - val;
                }),
            );
        }
    }
}
