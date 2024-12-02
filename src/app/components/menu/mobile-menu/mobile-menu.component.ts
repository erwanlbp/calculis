import { Component } from '@angular/core';
import { MatAnchor, MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatList, MatListItem, MatListItemIcon } from '@angular/material/list';
import { MatToolbar } from '@angular/material/toolbar';
import { NgForOf, NgIf } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MENU_ITEMS } from '../menu';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-mobile-menu',
  standalone: true,
  imports: [
    MatAnchor,
    MatButton,
    MatIcon,
    MatList,
    MatListItem,
    MatListItemIcon,
    MatToolbar,
    NgForOf,
    NgIf,
    RouterLink,
    RouterLinkActive,
    MatTooltip
  ],
  templateUrl: './mobile-menu.component.html',
  styleUrl: './mobile-menu.component.css'
})
export class MobileMenuComponent {

  menuItems = MENU_ITEMS;

}
