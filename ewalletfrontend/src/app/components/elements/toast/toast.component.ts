// toast.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { transition, style, animate } from '@angular/animations'; // Fix import
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-toast',
  imports: [CommonModule],
  template: `
    <div *ngIf="show"
         [@fadeAnimation]
         class="fixed top-4 right-4 z-50 min-w-[300px] p-4 rounded-lg shadow-lg"
         [ngClass]="getTypeClass()">
      <div class="flex items-start">
        <div class="flex-shrink-0">
          <!-- Success Icon -->
          <svg *ngIf="type === 'success'" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd"/>
          </svg>
          <!-- Error Icon -->
          <svg *ngIf="type === 'error'" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clip-rule="evenodd"/>
          </svg>
        </div>
        <div class="ml-3 w-full">
          <p class="text-sm font-medium">
            {{ message }}
          </p>
        </div>
        <button
          (click)="hide()"
          class="ml-4 inline-flex flex-shrink-0 text-current">
          <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"/>
          </svg>
        </button>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `],
  animations: [
    trigger('fadeAnimation', [
      transition(':enter', [
        style({opacity: 0, transform: 'translateY(-20px)'}),
        animate('300ms ease-out', style({opacity: 1, transform: 'translateY(0)'}))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({opacity: 0, transform: 'translateY(-20px)'}))
      ])
    ])
  ]
})
export class ToastComponent implements OnInit, OnDestroy {
  show = false;
  message = '';
  type: 'success' | 'error' = 'success';
  private subscription: Subscription;
  private timeout: any;

  constructor(private toastService: ToastService) {
    this.subscription = this.toastService.toastState$.subscribe(
      (state) => {
        if (state) {
          this.show = true;
          this.message = state.message;
          this.type = state.type;
          this.setAutoHide();
        }
      }
    );
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  hide(): void {
    this.show = false;
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  private setAutoHide(): void {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(() => {
      this.hide();
    }, 5000); // Hide after 5 seconds
  }

  getTypeClass(): string {
    return this.type === 'success'
      ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
      : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100';
  }
}
function trigger(arg0: string, arg1: any[]): any {
    throw new Error('Function not implemented.');
}

