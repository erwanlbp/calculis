import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Game } from '../../model/game.class';
import { NavController } from '@ionic/angular';

@Component({
    selector: 'app-after-game-options',
    templateUrl: './after-game-options.component.html',
    styleUrls: ['./after-game-options.component.scss'],
})
export class AfterGameOptionsComponent implements OnInit {

    @Input() userIsCorrect = false;
    @Input() game: Game;
    @Output() restart: EventEmitter<void> = new EventEmitter<void>();
    @Output() nextGame: EventEmitter<void> = new EventEmitter<void>();

    constructor(
        private navController: NavController,
    ) {
    }

    ngOnInit() {
    }

    restartGame() {
        this.restart.emit();
    }

    continueNextGame() {
        this.nextGame.emit();
    }
}
