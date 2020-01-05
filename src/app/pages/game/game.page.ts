import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GameConfig } from 'src/app/model/game-config.interface';
import { Game } from 'src/app/model/game.class';

@Component({
    selector: 'app-game',
    templateUrl: './game.page.html',
    styleUrls: ['./game.page.scss'],
})
export class GamePage implements OnInit {

    number$: Observable<number>;

    game: Game;
    sequenceIsOver = false;
    userAnswerMessage: string;

    constructor() {
    }

    ngOnInit() {
        this.game = new Game({
            rangeMin: -5,
            rangeMax: 5,
            serieSize: 3,
            timePrinted: 1000,
        });
        this.number$ = this.game.getNumbers$();
        this.number$.subscribe({ complete: () => this.sequenceIsOver = true });
    }

    answered(userIsCorrect: boolean) {
        console.log('user is correct ?', userIsCorrect);
        this.userAnswerMessage = userIsCorrect ? 'Correct !' : `Raté, la réponse était ${this.game.getAnswer()}`;
    }
}
