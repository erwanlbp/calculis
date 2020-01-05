import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameUserAnswerComponent } from './game-user-answer.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    exports: [GameUserAnswerComponent],
    declarations: [GameUserAnswerComponent],
})
export class GameUserAnswerComponentModule {
}
