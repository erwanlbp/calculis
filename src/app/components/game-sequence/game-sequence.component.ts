import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-game-sequence',
  templateUrl: './game-sequence.component.html',
  styleUrls: ['./game-sequence.component.scss'],
})
export class GameSequenceComponent implements OnInit {

  @Input() number$: Observable<number>;

  constructor() { }

  ngOnInit() { }
}
