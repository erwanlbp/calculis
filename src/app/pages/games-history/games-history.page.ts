import { Component, OnInit } from '@angular/core';
import { RoutePathConstants } from '../../constants/route.constants';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { map } from 'rxjs/operators';
import { GamesHistoryService } from 'src/app/services/games-history.service';
import { UserGame } from 'src/app/model/user-game.class';

@Component({
    selector: 'app-games-history',
    templateUrl: './games-history.page.html',
    styleUrls: ['./games-history.page.scss'],
})
export class GamesHistoryPage implements OnInit {

    ROOT_PATH: string = RoutePathConstants.HOME;

    isNotConnected$: Observable<boolean>;
    gamesHistory$: Observable<UserGame[]>;

    constructor(
        private authService: AuthService,
        private gamesHistoryService: GamesHistoryService,
    ) {
    }

    ngOnInit() {
        this.isNotConnected$ = this.authService.isConnected$().pipe(map(value => !value));
        this.gamesHistory$ = this.gamesHistoryService.fetchUserGamesHistory$();
    }
}
