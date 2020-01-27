import { Component, OnInit } from '@angular/core';
import { RoutePathConstants } from '../../constants/route.constants';
import { Observable } from 'rxjs';
import { UserScore } from '../../model/user-scores.interface';
import { ScoreService } from '../../services/score.service';

@Component({
    selector: 'app-scores',
    templateUrl: './scores.page.html',
    styleUrls: ['./scores.page.scss'],
})
export class ScoresPage implements OnInit {

    ROOT_PATH: string = RoutePathConstants.HOME;

    scores$: Observable<UserScore[]>;

    constructor(
        private scoreService: ScoreService,
    ) {
    }

    ngOnInit() {
        this.scores$ = this.scoreService.fetchUserScores$();
    }
}
