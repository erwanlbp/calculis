import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-game-user-answer',
  templateUrl: './game-user-answer.component.html',
  styleUrls: ['./game-user-answer.component.scss'],
})
export class GameUserAnswerComponent implements OnInit {

  form: FormGroup;

  @Input() answer: number;
  @Output() answered: EventEmitter<boolean> = new EventEmitter();

  constructor() { }

  ngOnInit() {
    this.form = new FormGroup({ answer: new FormControl([null, Validators.required]) });
  }

  submitAnswer() {
    const userAnswer = this.form.get('answer').value;
    this.answered.emit(userAnswer === this.answer);
  }
}
