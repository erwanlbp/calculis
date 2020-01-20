import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Game } from 'src/app/model/game.class';
import { GameService } from '../../services/game.service';

@Component({
    selector: 'app-game',
    templateUrl: './game.page.html',
    styleUrls: ['./game.page.scss'],
})
export class GamePage implements OnInit {

    number$: Observable<number>;

    game: Game;
    sequenceIsOver: boolean;
    userIsCorrect: boolean;

    constructor(
        private gameService: GameService,
    ) {
    }

    ngOnInit() {
        this.restart();
    }

    private startGame() {
        console.log('current level', this.gameService.getCurrentLevel());
        this.number$ = this.game.getNumbers$();
        this.number$.subscribe({complete: () => this.sequenceIsOver = true});
    }

    private reset() {
        this.sequenceIsOver = false;
        this.userIsCorrect = null;
    }

    restart() {
        this.reset();
        this.game = this.gameService.newGame();
        this.startGame();
    }

    nextGame() {
        this.reset();
        this.game = this.gameService.nextGameLevel();
        this.startGame();
    }
}
