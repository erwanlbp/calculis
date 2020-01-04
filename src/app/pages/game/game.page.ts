import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
})
export class GamePage implements OnInit {

  number$: BehaviorSubject<number> = new BehaviorSubject(0);

  config = {
      rangeMin: -5,
      rangeMax: 5,
      serieSize: 3,
      timePrinted: 1000,
  };

  constructor() {
  }

  ngOnInit() {
      this.initInterval();
  }

  private initInterval() {
      setInterval(() => this.nextNumber(), this.config.timePrinted);
  }

  randomNumber(): number {
      return Math.floor(Math.random() * (this.config.rangeMin - this.config.rangeMax)) + this.config.rangeMax + 1;
  }

  private nextNumber() {
      const n = this.randomNumber();
      console.log('next number : ', n);
      this.number$.next(n);
  }
}
