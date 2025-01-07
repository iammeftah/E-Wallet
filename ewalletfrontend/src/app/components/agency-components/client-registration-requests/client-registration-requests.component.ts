import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {AgencyService} from '../../../services/agency.service';
import {Client} from '../../../models/auth.model';



@Component({
  selector: 'app-client-registration-requests',
  templateUrl: './client-registration-requests.component.html',
  styleUrls: ['./client-registration-requests.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ClientRegistrationRequestsComponent implements OnInit {
  requests: Client[] = [];
  filteredRequests: Client[] = [];
  pageSize = 10;
  currentPage = 1;
  searchTerm = '';
  isLoading = false;
  error = '';
  successMessage = '';

  constructor(private agencyService: AgencyService) {}

  ngOnInit() {
    this.loadRegistrationRequests();
  }

  loadRegistrationRequests() {
    this.isLoading = true;
    this.agencyService.getClientRegistrationRequests().subscribe({
      next: (data) => {
        this.requests = data;
        this.filteredRequests = [...this.requests];
        this.isLoading = false;
      },
      error: (error) => {
        this.error = 'Failed to load registration requests: ' + error.message;
        this.isLoading = false;
      }
    });
  }

  // In client-registration-requests.component.ts
  isPending(request: Client): boolean {
    return request.status === 'PENDING';
  }

  canApprove(request: Client): boolean {
    return request.status === 'PENDING';
  }

  canReject(request: Client): boolean {
    return request.status === 'PENDING';
  }



  get paginatedRequests() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredRequests.slice(startIndex, startIndex + this.pageSize);
  }

  onPageChange(page: number) {
    this.currentPage = page;
  }

  onSearch() {
    this.filteredRequests = this.requests.filter(request =>
      request.firstName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      request.lastName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      request.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      request.phone.includes(this.searchTerm)
    );
    this.currentPage = 1;
  }

  getPaginationArray(): number[] {
    const pageCount = Math.ceil(this.filteredRequests.length / this.pageSize);
    const currentPage = this.currentPage;
    const visiblePages = 5;

    let startPage = Math.max(currentPage - Math.floor(visiblePages / 2), 1);
    let endPage = startPage + visiblePages - 1;

    if (endPage > pageCount) {
      endPage = pageCount;
      startPage = Math.max(endPage - visiblePages + 1, 1);
    }

    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  }

  onPreviousPage() {
    if (this.currentPage > 1) {
      this.onPageChange(this.currentPage - 1);
    }
  }

  onNextPage() {
    const pageCount = Math.ceil(this.filteredRequests.length / this.pageSize);
    if (this.currentPage < pageCount) {
      this.onPageChange(this.currentPage + 1);
    }
  }

  approveRequest(id: string) {
    this.isLoading = true;
    this.error = '';
    this.successMessage = '';

    this.agencyService.approveClientRegistration(id).subscribe({
      next: (updatedClient) => {
        const index = this.requests.findIndex(r => r.id === id);
        if (index !== -1) {
          this.requests[index] = updatedClient;
          this.filteredRequests = [...this.requests];
          this.successMessage = 'Registration request approved successfully';
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.error = 'Error approving request: ' + error.message;
        this.isLoading = false;
      }
    });
  }

  rejectRequest(id: string) {
    this.isLoading = true;
    this.error = '';
    this.successMessage = '';

    this.agencyService.rejectClientRegistration(id).subscribe({
      next: (updatedClient) => {
        const index = this.requests.findIndex(r => r.id === id);
        if (index !== -1) {
          this.requests[index] = updatedClient;
          this.filteredRequests = [...this.requests];
          this.successMessage = 'Registration request rejected successfully';
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.error = 'Error rejecting request: ' + error.message;
        this.isLoading = false;
      }
    });
  }

  viewRequest(id: string) {
    // Implementation for viewing request details
    console.log(`Viewing request ${id}`);
  }

  protected readonly Math = Math;
}

