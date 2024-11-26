import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { GamesService } from '../../../services/games.service';

@Component({
  selector: 'app-game-start',
  standalone: true,
  imports: [],
  templateUrl: './game-start.component.html',
  styleUrl: './game-start.component.css'
})
export class GameStartComponent implements OnInit {

  activatedRoute = inject(ActivatedRoute)
  gameService = inject(GamesService);

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.gameService.getCurrentGame$(params["gameId"]).subscribe(game => {
        console.log(game)
      });
    })
  }

}
