import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { Agent } from '../../../models/auth.model';
import { BackofficeService } from '../../../services/backoffice.service';

@Component({
  selector: 'app-registration-requests',
  templateUrl: './registration-requests.component.html',
  styleUrls: ['./registration-requests.component.css'],
  standalone: true,
  imports: [CommonModule],
  providers: [BackofficeService]  // Add this line

})
export class RegistrationRequestsComponent implements OnInit {
  registrationRequests$: Observable<Agent[]>;
  pageSize = 21;
  currentPage$ = new BehaviorSubject<number>(1);
  selectedRequest: Agent | null = null;
  error: string | null = null;
  protected readonly Math = Math;

  constructor(private backofficeService: BackofficeService) {
    this.registrationRequests$ = this.backofficeService.getPendingRequests().pipe(
      tap(requests => {
        console.log('Component received requests:', requests);
      }),
      catchError(error => {
        console.error('Error fetching requests:', error);
        this.error = 'Failed to load registration requests';
        return [];
      })
    );
  }

  ngOnInit() {
    // Remove AOS initialization as it's not needed
    this.loadRequests();
  }

  loadRequests() {
    this.registrationRequests$.subscribe(
      requests => console.log('Loaded requests:', requests),
      error => console.error('Error loading requests:', error)
    );
  }

  get paginatedRequests$(): Observable<Agent[]> {
    return combineLatest([this.registrationRequests$, this.currentPage$]).pipe(
      map(([requests, currentPage]) => {
        const startIndex = (currentPage - 1) * this.pageSize;
        return requests.slice(startIndex, startIndex + this.pageSize);
      })
    );
  }

  getPaginationArray$(): Observable<number[]> {
    return this.registrationRequests$.pipe(
      map(requests => {
        const pageCount = Math.ceil(requests.length / this.pageSize);
        const currentPage = this.currentPage$.getValue();
        const visiblePages = 5;

        let startPage = Math.max(currentPage - Math.floor(visiblePages / 2), 1);
        let endPage = startPage + visiblePages - 1;

        if (endPage > pageCount) {
          endPage = pageCount;
          startPage = Math.max(endPage - visiblePages + 1, 1);
        }

        return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
      })
    );
  }

  get totalPages$(): Observable<number> {
    return this.registrationRequests$.pipe(
      map(requests => Math.ceil(requests.length / this.pageSize))
    );
  }

  onPageChange(page: number): void {
    this.currentPage$.next(page);
  }

  onPreviousPage(): void {
    const currentPage = this.currentPage$.getValue();
    if (currentPage > 1) {
      this.currentPage$.next(currentPage - 1);
    }
  }

  onNextPage(): void {
    this.registrationRequests$.pipe(
      map(requests => Math.ceil(requests.length / this.pageSize))
    ).subscribe(totalPages => {
      const currentPage = this.currentPage$.getValue();
      if (currentPage < totalPages) {
        this.currentPage$.next(currentPage + 1);
      }
    });
  }

  openRequestModal(request: Agent): void {
    this.selectedRequest = request;
  }

  closeRequestModal(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('fixed')) {
      this.selectedRequest = null;
    }
  }

  onAcceptRequest(request: Agent): void {
    if (request.id !== undefined && request.id !== null) {
      const requestId = String(request.id); // Use String() constructor instead of toString()
      this.backofficeService.acceptRequest(requestId).pipe(
        tap(() => {
          this.registrationRequests$ = this.backofficeService.getPendingRequests();
          this.selectedRequest = null;
        }),
        catchError(error => {
          console.error('Error accepting request:', error);
          return [];
        })
      ).subscribe();
    }
  }

  onRejectRequest(request: Agent): void {
    if (request.id !== undefined && request.id !== null) {
      const requestId = String(request.id); // Use String() constructor instead of toString()
      this.backofficeService.declineRequest(requestId).pipe(
        tap(() => {
          this.registrationRequests$ = this.backofficeService.getPendingRequests();
          this.selectedRequest = null;
        }),
        catchError(error => {
          console.error('Error rejecting request:', error);
          return [];
        })
      ).subscribe();
    }
  }
}
