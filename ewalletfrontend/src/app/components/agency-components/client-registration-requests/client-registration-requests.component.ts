import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ClientRegistrationRequest {
  id: number;
  clientName: string;
  email: string;
  phone: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  submissionDate: Date;
}

@Component({
  selector: 'app-client-registration-requests',
  templateUrl: './client-registration-requests.component.html',
  styleUrls: ['./client-registration-requests.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ClientRegistrationRequestsComponent implements OnInit {
  requests: ClientRegistrationRequest[] = [];
  filteredRequests: ClientRegistrationRequest[] = [];
  pageSize = 10;
  currentPage = 1;
  searchTerm = '';

  ngOnInit() {
    // Populate with dummy data
    this.requests = Array(20).fill(null).map((_, index) => ({
      id: index + 1,
      clientName: `Client ${index + 1}`,
      email: `client${index + 1}@example.com`,
      phone: `+212${6000000 + index}`,
      status: ['Pending', 'Approved', 'Rejected'][Math.floor(Math.random() * 3)] as 'Pending' | 'Approved' | 'Rejected',
      submissionDate: new Date(Date.now() - Math.floor(Math.random() * 10000000000))
    }));
    this.filteredRequests = [...this.requests];
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
      request.clientName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
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

  protected readonly Math = Math;
}

