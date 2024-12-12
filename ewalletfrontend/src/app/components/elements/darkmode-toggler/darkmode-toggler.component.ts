import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgIf } from '@angular/common';

type DarkModeState = 'light' | 'dark' | 'system';

@Component({
  selector: 'app-darkmode-toggler',
  styleUrl: './darkmode-toggler.component.css',
  imports: [
    NgIf
  ],
  template: `
    <button
      (click)="cycleDarkModeState()"
      class="outline-none p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900 relative"
    >
      <!-- Light Mode Icon -->
      <svg *ngIf="currentState === 'light'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sun text-neutral-900"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/></svg>

      <!-- Dark Mode Icon -->
      <svg *ngIf="currentState === 'dark'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-moon text-neutral-100"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>

      <!-- System Mode Icon -->
      <div *ngIf="currentState === 'system'" class="flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-laptop text-neutral-900 dark:text-neutral-100"><path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16"/></svg>
      </div>
    </button>
  `
})
export class DarkmodeTogglerComponent implements OnInit, OnDestroy {
  currentState: DarkModeState = 'light';
  private mediaQuery: MediaQueryList;
  private mediaQueryListener: (e: MediaQueryListEvent) => void;

  constructor() {
    this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    // Create a listener for system dark mode changes
    this.mediaQueryListener = (e) => {
      if (this.currentState === 'system') {
        this.applyDarkMode(e.matches);
      }
    };
  }

  ngOnInit() {
    // Retrieve saved state or default to 'system'
    const savedState = localStorage.getItem('darkModeState') as DarkModeState;
    this.currentState = savedState || 'system';

    // Apply initial mode
    this.applyCurrentMode();

    // Add listener for system dark mode changes
    this.mediaQuery.addListener(this.mediaQueryListener);

    // Initial check for system preference
    if (this.currentState === 'system') {
      this.applyDarkMode(this.mediaQuery.matches);
    }
  }

  ngOnDestroy() {
    // Remove listener to prevent memory leaks
    this.mediaQuery.removeListener(this.mediaQueryListener);
  }

  cycleDarkModeState() {
    const states: DarkModeState[] = ['light', 'dark', 'system'];
    const currentIndex = states.indexOf(this.currentState);
    const nextIndex = (currentIndex + 1) % states.length;
    this.currentState = states[nextIndex];

    // Save the new state
    localStorage.setItem('darkModeState', this.currentState);

    // Apply the new mode
    this.applyCurrentMode();
  }

  private applyCurrentMode() {
    switch (this.currentState) {
      case 'light':
        this.applyDarkMode(false);
        break;
      case 'dark':
        this.applyDarkMode(true);
        break;
      case 'system':
        this.applyDarkMode(this.mediaQuery.matches);
        break;
    }
  }

  private applyDarkMode(isDark: boolean) {
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }
}

