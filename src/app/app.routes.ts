import { Routes } from '@angular/router';
import { PageHomeComponent } from './pages/page-home/page-home.component';
import { PageAccountComponent } from './pages/page-account/page-account.component';
import { PageGamesComponent } from './pages/page-games/page-games.component';

export const routes: Routes = [
    { path: '', component: PageHomeComponent },
    { path: 'home', component: PageHomeComponent },
    { path: 'account', component: PageAccountComponent },
    { path: 'games', component: PageGamesComponent },
];
