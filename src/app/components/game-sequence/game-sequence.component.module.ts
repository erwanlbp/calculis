import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameSequenceComponent } from './game-sequence.component';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
    ],
    exports: [GameSequenceComponent],
    declarations: [GameSequenceComponent],
})
export class GameSequenceComponentModule {
}
