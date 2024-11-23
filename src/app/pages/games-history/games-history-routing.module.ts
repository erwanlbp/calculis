import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GamesHistoryPage } from './games-history.page';

const routes: Routes = [
    {
        path: '',
        component: GamesHistoryPage
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class GamesHistoryPageRoutingModule {
}
