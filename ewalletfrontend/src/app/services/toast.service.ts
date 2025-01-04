
// toast.service.ts
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface ToastState {
  message: string;
  type: 'success' | 'error';
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastSubject = new Subject<ToastState | null>();
  toastState$ = this.toastSubject.asObservable();

  showSuccess(message: string): void {
    this.toastSubject.next({ message, type: 'success' });
  }

  showError(message: string): void {
    this.toastSubject.next({ message, type: 'error' });
  }

  hide(): void {
    this.toastSubject.next(null);
  }
}
