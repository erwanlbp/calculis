import { Component, inject, Input } from '@angular/core';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import { GamesService } from '../../../services/games.service';
import { UtilsService } from '../../../services/utils.service';

@Component({
  selector: 'app-level-end',
  standalone: true,
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatLabel
  ],
  templateUrl: './level-end.component.html',
  styleUrl: './level-end.component.css'
})
export class LevelEndComponent {

  @Input() gameId!: string
  @Input() currentLevelId!: string

  gameService = inject(GamesService)
  utilsService = inject(UtilsService)

  answer(val: string) {
    if (!this.gameId || this.currentLevelId === undefined) {
      this.utilsService.showToast(`Echec d'envoi, réessayez bientot`)
      return
    }
    this.gameService.answerLevel(this.gameId, this.currentLevelId, Number(val))
      .then(x => console.log('answer response', x))
  }
}
