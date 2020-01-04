import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CounterMorePopoverComponent } from './counter-more-popover.component';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
    ],
    exports: [CounterMorePopoverComponent],
    declarations: [CounterMorePopoverComponent],
    entryComponents: [CounterMorePopoverComponent]
})
export class CounterMorePopoverComponentModule {
}
