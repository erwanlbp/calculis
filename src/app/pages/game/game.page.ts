import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Game } from 'src/app/model/game.class';
import { GameService } from '../../services/game.service';
import { RoutePathConstants } from '../../constants/route.constants';
import { GameState } from '../../model/game-state.enum';

@Component({
    selector: 'app-game',
    templateUrl: './game.page.html',
    styleUrls: ['./game.page.scss'],
})
export class GamePage implements OnInit {

    ROOT_PATH: string = RoutePathConstants.ROOT;

    number$: Observable<number>;

    game: Game;
    gameState: GameState = GameState.PRE_GAME;
    userIsCorrect: boolean;

    constructor(
        private gameService: GameService,
    ) {
    }

    ngOnInit() {
        this.restart();
    }

    private startGame() {
        this.gameState = GameState.SEQUENCE;
        this.number$ = this.game.getNumbers$();
        this.number$.subscribe({complete: () => this.gameState = GameState.USER_ANSWER});
    }

    restart() {
        this.game = this.gameService.newGame();
        this.gameState = GameState.PRE_GAME;
    }

    nextGame() {
        this.game = this.gameService.nextGameLevel();
        this.gameState = GameState.PRE_GAME;
    }

    answered(userIsCorrect: boolean) {
        this.userIsCorrect = userIsCorrect;
        this.gameState = GameState.POST_GAME;
    }
}
