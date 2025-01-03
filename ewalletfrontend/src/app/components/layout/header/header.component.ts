import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DarkmodeTogglerComponent } from '../../elements/darkmode-toggler/darkmode-toggler.component';

import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import {User} from '../../../models/auth.model';
import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, DarkmodeTogglerComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isMenuOpen = false;
  isDropdownOpen = false;
  currentUser: User | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
  }

  toggleMobileMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  getUserInitials(): string {
    if (!this.currentUser?.firstName || !this.currentUser?.lastName) return '';
    return `${this.currentUser.firstName.charAt(0)}.${this.currentUser.lastName}`;
  }

  getFirstInitial(): string {
    return this.currentUser?.firstName?.charAt(0) || '';
  }

  logout() {
    // First clear local data
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.authService.currentUserSubject.next(null);

    // Then attempt server logout
    this.authService.signOut().pipe(
      catchError(error => {
        console.error('Logout error:', error);
        return of(void 0); // Continue with navigation even if server logout fails
      })
    ).subscribe(() => {
      this.router.navigate(['/sign-in']);
    });
  }

  closeDropdown(event: Event) {
    if (!(event.target as HTMLElement).closest('.profile-dropdown')) {
      this.isDropdownOpen = false;
    }
  }
}
