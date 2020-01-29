import { Component, OnInit } from '@angular/core';
import { RoutePathConstants } from '../../constants/route.constants';
import { Observable } from 'rxjs';
import { UserScore } from '../../model/user-scores.interface';
import { ScoreService } from '../../services/score.service';
import { AuthService } from '../../services/auth.service';
import { map } from 'rxjs/operators';

@Component({
    selector: 'app-scores',
    templateUrl: './scores.page.html',
    styleUrls: ['./scores.page.scss'],
})
export class ScoresPage implements OnInit {

    ROOT_PATH: string = RoutePathConstants.HOME;

    isNotConnected$: Observable<boolean>;
    scores$: Observable<UserScore[]>;

    constructor(
        private scoreService: ScoreService,
        private authService: AuthService,
    ) {
    }

    ngOnInit() {
        this.isNotConnected$ = this.authService.isConnected$().pipe(map(value => !value));
        this.scores$ = this.scoreService.fetchUserScores$();
    }

    connect() {
        this.authService.login();
    }
}
