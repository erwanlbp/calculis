import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-level-start',
  standalone: true,
  imports: [],
  templateUrl: './level-start.component.html',
  styleUrl: './level-start.component.css'
})
export class LevelStartComponent {

  @Input()
  numbers: number[] = []

}
