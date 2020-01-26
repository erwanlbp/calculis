import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { GamePage } from './game.page';
import { RouterModule, Routes } from '@angular/router';
import { PipesModule } from '../../pipes/pipes.module';
import { AfterGameOptionsComponent } from './after-game-options/after-game-options.component';
import { GameSequenceComponent } from './game-sequence/game-sequence.component';
import { GameUserAnswerComponent } from './game-user-answer/game-user-answer.component';

const routes: Routes = [
    {path: '', component: GamePage},
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        IonicModule,
        RouterModule.forChild(routes),
        PipesModule,
    ],
    declarations: [
        GamePage,
        GameSequenceComponent,
        GameUserAnswerComponent,
        AfterGameOptionsComponent,
    ]
})
export class GamePageModule {
}
