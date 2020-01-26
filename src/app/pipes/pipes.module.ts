import { NgModule } from '@angular/core';
import { SignedNumberPipe } from './signed-number.pipe';

@NgModule({
    exports: [SignedNumberPipe,],
    declarations: [SignedNumberPipe]
})
export class PipesModule {
}
