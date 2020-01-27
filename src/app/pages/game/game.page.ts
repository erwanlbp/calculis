import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Game } from 'src/app/model/game.class';
import { GameService } from '../../services/game.service';
import { RoutePathConstants } from '../../constants/route.constants';
import { GameState } from '../../model/game-state.enum';
import { ScoreService } from '../../services/score.service';
import { ActivatedRoute } from "@angular/router";
import { map, switchMap, take } from "rxjs/operators";
import { GameDifficulty } from "../../model/game-difficulty.enum";

@Component({
    selector: 'app-game',
    templateUrl: './game.page.html',
    styleUrls: ['./game.page.scss'],
})
export class GamePage implements OnInit, OnDestroy {

    ROOT_PATH: string = RoutePathConstants.ROOT;

    number$: Observable<number>;

    difficulty: GameDifficulty;
    game: Game;
    gameState: GameState = GameState.PRE_GAME;
    userIsCorrect: boolean;

    constructor(
        private gameService: GameService,
        private scoreService: ScoreService,
        private route: ActivatedRoute,
    ) {
    }

    ngOnInit() {
        this.route.queryParams.pipe(
            map(params => {
                console.log('sps', params);
                return params.difficulty as GameDifficulty
            }),
            switchMap((difficulty: GameDifficulty) => {
                console.log('sp', difficulty);
                this.difficulty = difficulty;
                return this.scoreService.fetchUserScore$(this.difficulty);
            }),
            take(1),
        ).subscribe(score => {
            console.log('s', score);
            this.restart(score.currentLevel || 1);
        });
    }

    startGame() {
        this.gameState = GameState.SEQUENCE;
        this.number$ = this.game.getNumbers$();
        this.number$.subscribe({complete: () => this.gameState = GameState.USER_ANSWER});
    }

    restart(defaultLevel: number = 1) {
        this.game = this.gameService.newGame(defaultLevel);
        this.gameState = GameState.PRE_GAME;
    }

    nextGame() {
        this.game = this.gameService.nextGameLevel();
        this.gameState = GameState.PRE_GAME;
    }

    answered(userIsCorrect: boolean) {
        this.userIsCorrect = userIsCorrect;
        if (userIsCorrect) {
            this.scoreService.updateBestScore(this.difficulty, this.game.level);
        } else {
            this.scoreService.resetProgress(this.difficulty);
        }
        this.gameState = GameState.POST_GAME;
    }

    ngOnDestroy(): void {
        if (this.gameState !== GameState.POST_GAME && this.gameState !== GameState.PRE_GAME && !!this.difficulty) {
            this.scoreService.resetProgress(this.difficulty);
        }
    }
}
