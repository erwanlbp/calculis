import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RoutePathConstants } from '../../constants/route.constants';
import { GameService } from '../../services/game.service';
import { GameDifficulty } from '../../model/game-difficulty.enum';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ActionSheetController } from '@ionic/angular';

@Component({
    selector: 'app-home',
    templateUrl: './home.page.html',
    styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

    isNotConnected$: Observable<boolean>;

    constructor(
        private router: Router,
        private gameService: GameService,
        private authService: AuthService,
        private actionSheetController: ActionSheetController,
    ) {
    }

    ngOnInit() {
        this.isNotConnected$ = this.authService.isConnected$().pipe(map(value => !value));
    }

    async goToPlay() {
        const actionSheet = await this.actionSheetController.create({
            header: 'Difficulté',
            subHeader: 'Sélectionnez le niveau de difficulté :',
            buttons: Object.keys(GameDifficulty).map(key => ({
                text: GameDifficulty[key],
                role: 'selected',
                handler: () => {
                    this.router.navigate([RoutePathConstants.PLAY], {queryParams: {difficulty: GameDifficulty[key]}});
                }
            })),
        });
        await actionSheet.present();
    }

    connect() {
        this.authService.login();
    }
}
