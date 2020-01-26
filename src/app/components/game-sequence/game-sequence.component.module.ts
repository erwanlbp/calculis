import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameSequenceComponent } from './game-sequence.component';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        PipesModule,
    ],
    exports: [GameSequenceComponent],
    declarations: [GameSequenceComponent],
})
export class GameSequenceComponentModule {
}
