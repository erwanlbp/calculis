import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    { path: '', redirectTo: 'play', pathMatch: 'full' },
    { path: 'play', children: [{ path: '', loadChildren: () => import('./pages/game/game.page.module').then(m => m.GamePageModule) }] },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
