import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, PopoverController } from '@ionic/angular';
import { UtilsService } from "../../services/utils.service";
import { CounterService } from "../../services/counter.service";
import { Counter } from "../../model/counter.interface";

@Component({
    selector: 'app-counter-more-popover',
    templateUrl: './counter-more-popover.component.html',
    styleUrls: ['./counter-more-popover.component.scss'],
})
export class CounterMorePopoverComponent implements OnInit {

    private counter: Counter;

    constructor(
        private navParams: NavParams,
        private popoverController: PopoverController,
        private navController: NavController,
        private utilsService: UtilsService,
        private counterService: CounterService,
    ) {
    }

    ngOnInit() {
        this.counter = this.navParams.get('counter');
    }

    close() {
        this.popoverController.dismiss();
    }

    delete() {
        this.utilsService.askForConfirmation()
            .then(confirmed => {
                if (!confirmed) {
                    return;
                }
                this.counterService.deleteCounter(this.counter);
            })
            .then(() => this.close());
    }

    events() {
        this.navController.navigateForward(`/counter-events/${this.counter.name}`)
            .then(() => this.close());
    }

    chart() {
        this.navController.navigateForward(`/counter-chart/${this.counter.name}`)
            .then(() => this.close());
    }
}
