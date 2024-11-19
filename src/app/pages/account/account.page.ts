import { Component, OnInit } from '@angular/core';
import { RoutePathConstants } from '../../constants/route.constants';
import { Observable } from 'rxjs';
import { ScoreService } from '../../services/score.service';
import { AuthService } from '../../services/auth.service';
import { map } from 'rxjs/operators';
import { AccountService } from 'src/app/services/account.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
    selector: 'app-account',
    templateUrl: './account.page.html',
    styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {

    ROOT_PATH: string = RoutePathConstants.HOME;

    showDeleteAccount$: Observable<boolean>;

    constructor(
        private authService: AuthService,
        private accountService: AccountService,
    ) {
    }

    ngOnInit() {
        this.showDeleteAccount$ = this.authService.isConnected$().pipe(
            map(value => !!value && window.location.hostname.includes('localhost')),
        );
    }

    askConfirm() {
        return confirm("Confirmer ?")
    }

    deleteAccount() {
        this.accountService.deleteAccount();
    }
}
