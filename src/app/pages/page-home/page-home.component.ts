import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-page-home',
  imports: [
    CommonModule,
    MatToolbarModule,
  ],
  templateUrl: './page-home.component.html',
  styleUrl: './page-home.component.css',
  standalone:true,
})
export class PageHomeComponent {

}
