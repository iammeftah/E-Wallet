// header.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DarkmodeTogglerComponent } from '../../elements/darkmode-toggler/darkmode-toggler.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, DarkmodeTogglerComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  isMenuOpen = false;

  toggleMobileMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
