import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IonInput } from '@ionic/angular';

@Component({
    selector: 'app-game-user-answer',
    templateUrl: './game-user-answer.component.html',
    styleUrls: ['./game-user-answer.component.scss'],
})
export class GameUserAnswerComponent implements OnInit {

    form: FormGroup;

    @Input() answer: number;
    @Output() answered: EventEmitter<boolean> = new EventEmitter();

    @ViewChild('answerInput') answerInput: IonInput;

    constructor() {
    }

    ngOnInit() {
        this.form = new FormGroup({answer: new FormControl(null, [Validators.required, Validators.pattern('^\\-?\\d+$')])});
        setTimeout(() => this.answerInput.setFocus(), 150);
    }

    submitAnswer() {
        const userAnswer = Number(this.form.get('answer').value);
        this.answered.emit(userAnswer === this.answer);
    }
}
