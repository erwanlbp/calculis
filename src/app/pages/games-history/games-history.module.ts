import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GamesHistoryPageRoutingModule } from './games-history-routing.module';

import { GamesHistoryPage } from './games-history.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GamesHistoryPageRoutingModule
  ],
  declarations: [GamesHistoryPage]
})
export class GamesHistoryPageModule { }
