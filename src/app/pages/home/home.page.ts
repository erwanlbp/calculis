import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RoutePathConstants } from '../../constants/route.constants';
import { GameConfig } from '../../model/game-config.interface';
import { GameService } from '../../services/game.service';
import { GameDifficulty } from '../../model/game-difficulty.enum';

@Component({
    selector: 'app-home',
    templateUrl: './home.page.html',
    styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

    defaultConfig: GameConfig;

    constructor(
        private router: Router,
        private gameService: GameService,
    ) {
    }

    ngOnInit() {
        this.defaultConfig = this.gameService.getDefaultConfig();
    }

    goToPlay() {
        this.router.navigate([RoutePathConstants.PLAY], {queryParams: {difficulty: GameDifficulty.MEDIUM}});
    }
}
