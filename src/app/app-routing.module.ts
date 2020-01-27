import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RouteConstants } from './constants/route.constants';

const routes: Routes = [
    {path: '', redirectTo: RouteConstants.HOME, pathMatch: 'full'},
    {path: RouteConstants.PLAY, loadChildren: () => import('./pages/game/game.page.module').then(m => m.GamePageModule)},
    {path: RouteConstants.HOME, loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule)},
    {path: RouteConstants.SCORES, loadChildren: () => import('./pages/scores/scores.module').then(m => m.ScoresPageModule)},
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
