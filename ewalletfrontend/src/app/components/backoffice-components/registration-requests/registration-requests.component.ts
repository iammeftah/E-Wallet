// registration-requests.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { Agent } from '../../../models/auth.model';
import { BackofficeService } from '../../../services/backoffice.service';

@Component({
  selector: 'app-registration-requests',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Main content -->
    <div class="p-6 bg-neutral-50 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 min-h-screen">
      <h2 class="text-2xl font-serif mb-6">Registration Requests</h2>

      <ng-container *ngIf="registrationRequests$ | async as requests">
        <!-- No data message -->
        <div *ngIf="requests.length === 0" class="text-center py-8 text-neutral-500 dark:text-neutral-400">
          No registration requests found
        </div>

        <!-- Grid of requests -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div *ngFor="let request of requests"
               class="bg-neutral-200 dark:bg-neutral-800 p-4 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
               (click)="openRequestModal(request)">
            <div class="flex justify-between items-start">
              <div>
                <p class="font-medium">{{request.firstName}} {{request.lastName}}</p>
                <p class="text-sm text-neutral-600 dark:text-neutral-400 mt-1">{{request.email}}</p>
                <p class="text-sm text-neutral-600 dark:text-neutral-400">{{request.phone}}</p>
                <p class="text-sm mt-2">
                  <span class="px-2 py-1 rounded-full text-xs"
                        [ngClass]="{
                          'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100': request.status === 'PENDING',
                          'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100': request.status === 'ACCEPTED',
                          'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100': request.status === 'DECLINED'
                        }">
                    {{request.status}}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </ng-container>
    </div>

    <!-- Modal -->
    <div *ngIf="selectedRequest"
         class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
         (click)="closeRequestModal($event)">
      <div class="bg-neutral-100 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200 rounded-lg p-6 max-w-lg w-full" (click)="$event.stopPropagation()">
        <!-- Modal content -->
        <h3 class="text-xl font-semibold mb-4">Request Details</h3>
        <div class="space-y-3">
          <div class="grid grid-cols-2 gap-2">
            <span class="text-neutral-600 dark:text-neutral-400">Name:</span>
            <span>{{selectedRequest.firstName}} {{selectedRequest.lastName}}</span>

            <span class="text-neutral-600 dark:text-neutral-400">Email:</span>
            <span>{{selectedRequest.email}}</span>

            <span class="text-neutral-600 dark:text-neutral-400">Phone:</span>
            <span>{{selectedRequest.phone}}</span>

            <span class="text-neutral-600 dark:text-neutral-400">ID Type:</span>
            <span>{{selectedRequest.idType}}</span>

            <span class="text-neutral-600 dark:text-neutral-400">ID Number:</span>
            <span>{{selectedRequest.idNumber}}</span>

            <span class="text-neutral-600 dark:text-neutral-400">Status:</span>
            <span>{{selectedRequest.status}}</span>
          </div>
        </div>

        <!-- Action buttons -->
        <div class="mt-6 flex justify-end space-x-4">
          <button class="secondary-button"
                  (click)="onRejectRequest(selectedRequest)">
            Reject
          </button>
          <button class="primary-button"
                  (click)="onAcceptRequest(selectedRequest)">
            Accept
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100%;
    }
  `]
})

export class RegistrationRequestsComponent implements OnInit {
  registrationRequests$: Observable<Agent[]>;
  selectedRequest: Agent | null = null;
  error: string | null = null;

  constructor(private backofficeService: BackofficeService) {
    this.registrationRequests$ = this.backofficeService.getPendingRequests().pipe(
      tap(requests => console.log('Requests loaded:', requests)),
      catchError(error => {
        console.error('Error:', error);
        this.error = 'Failed to load requests';
        return [];
      })
    );
  }

  ngOnInit() {
    // Initial load
    this.loadRequests();
  }

  loadRequests() {
    this.registrationRequests$ = this.backofficeService.getPendingRequests();
  }

  openRequestModal(request: Agent) {
    this.selectedRequest = request;
  }

  closeRequestModal(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('fixed')) {
      this.selectedRequest = null;
    }
  }

  onAcceptRequest(request: Agent) {
    if (request.id) {
      this.backofficeService.acceptRequest(request.id).subscribe({
        next: () => {
          this.selectedRequest = null;
          this.loadRequests();
        },
        error: (error) => console.error('Error accepting request:', error)
      });
    }
  }

  onRejectRequest(request: Agent) {
    if (request.id) {
      this.backofficeService.declineRequest(request.id).subscribe({
        next: () => {
          this.selectedRequest = null;
          this.loadRequests();
        },
        error: (error) => console.error('Error rejecting request:', error)
      });
    }
  }
}
