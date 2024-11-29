import { Component, inject, Input } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { GamesService } from '../../../services/games.service';

@Component({
  selector: 'app-level-end',
  standalone: true,
  imports: [
    MatButton,
    MatFormField,
    MatInput,
    MatLabel
  ],
  templateUrl: './level-end.component.html',
  styleUrl: './level-end.component.css'
})
export class LevelEndComponent {

  @Input()
  gameId: string = ''
  @Input()
  currentLevelId: string = ''

  gameService = inject(GamesService)

  answer(val: string) {
    console.log('answering', val)
    this.gameService.answerLevel(this.gameId, this.currentLevelId, Number(val))
      .then(x => console.log('answer response', x))
  }
}
