import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { RoutePathConstants } from './constants/route.constants';
import { AuthService } from './services/auth.service';
import { Observable } from 'rxjs';
import * as jsonPackage from './../../package.json';
import * as moment from 'moment';
import { UtilsService } from "./services/utils.service";

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {

    connected$: Observable<boolean>;
    version: string = jsonPackage.version;

    pages = [
        {title: 'Comment jouer ?', url: RoutePathConstants.HOME, icon: 'help'},
        {title: 'Jeu', url: RoutePathConstants.PLAY, icon: 'logo-game-controller-b'},
        {title: 'Scores', url: RoutePathConstants.SCORES, icon: 'podium'},
    ];

    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        private authService: AuthService,
        private utilsService: UtilsService,
    ) {
        this.initializeApp();
    }

    initializeApp() {
        moment.locale('fr-FR');
        this.platform.ready().then(() => {
            this.statusBar.styleDefault();
            this.splashScreen.hide();
        });
    }

    ngOnInit() {
        this.connected$ = this.authService.isConnected$();
    }

    logout() {
        this.authService.logout();
    }

    login() {
        this.authService.login()
            .then(() => this.utilsService.showToast('Connexion réussie'))
            .catch(() => this.utilsService.showToast('Echec de la connexion'));
    }
}
