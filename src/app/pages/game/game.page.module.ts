import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { GamePage } from './game.page';
import { RouterModule, Routes } from '@angular/router';
import { GameSequenceComponentModule } from 'src/app/components/game-sequence/game-sequence.component.module';
import { GameUserAnswerComponentModule } from 'src/app/components/game-user-answer/game-user-answer.component.module';
import { AfterGameOptionsComponent } from "../../components/after-game-options/after-game-options.component";

const routes: Routes = [
  {
    path: '',
    component: GamePage
  }
];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    GameSequenceComponentModule,
    GameUserAnswerComponentModule,
  ],
    declarations: [GamePage, AfterGameOptionsComponent]
})
export class GamePageModule { }
