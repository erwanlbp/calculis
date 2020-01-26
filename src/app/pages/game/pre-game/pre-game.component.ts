import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Game } from '../../../model/game.class';

@Component({
    selector: 'app-pre-game',
    templateUrl: './pre-game.component.html',
    styleUrls: ['./pre-game.component.scss'],
})
export class PreGameComponent implements OnInit {

    @Input() game: Game;
    @Output() start: EventEmitter<void> = new EventEmitter<void>();

    constructor() {
    }

    ngOnInit() {
    }

    startPlaying() {
        this.start.emit();
    }
}
