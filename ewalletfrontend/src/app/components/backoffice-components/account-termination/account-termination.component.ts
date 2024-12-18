import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface TerminationRequest {
  id: string;
  userId: string;
  userName: string;
  reason: string;
  feedback: string;
  requestDate: Date;
  status: 'pending' | 'approved' | 'rejected';
}

@Component({
  selector: 'app-account-termination',
  templateUrl: './account-termination.component.html',
  styleUrls: ['./account-termination.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class AccountTerminationComponent implements OnInit {
  terminationRequests: TerminationRequest[] = [];
  filteredRequests: TerminationRequest[] = [];
  pageSize = 10;
  currentPage = 1;
  searchTerm = '';

  ngOnInit() {
    // In a real application, you would fetch this data from your backend
    this.terminationRequests = [
      {
        id: '1',
        userId: 'user123',
        userName: 'John Doe',
        reason: 'no_longer_needed',
        feedback: 'I no longer require the services provided.',
        requestDate: new Date('2023-06-01'),
        status: 'pending'
      },
      {
        id: '2',
        userId: 'user456',
        userName: 'Jane Smith',
        reason: 'unsatisfied',
        feedback: 'The service did not meet my expectations.',
        requestDate: new Date('2023-05-28'),
        status: 'approved'
      },
      {
        id: '3',
        userId: 'user789',
        userName: 'Bob Johnson',
        reason: 'found_alternative',
        feedback: 'I found a better alternative for my needs.',
        requestDate: new Date('2023-05-25'),
        status: 'rejected'
      }
    ];
    this.filteredRequests = [...this.terminationRequests];
  }

  get paginatedRequests() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredRequests.slice(startIndex, startIndex + this.pageSize);
  }

  onPageChange(page: number) {
    this.currentPage = page;
  }

  getPaginationArray(): number[] {
    const pageCount = Math.ceil(this.filteredRequests.length / this.pageSize);
    const currentPage = this.currentPage;
    const visiblePages = 5; // Number of visible page buttons

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

  onSearch() {
    this.filteredRequests = this.terminationRequests.filter(request =>
      request.userName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      request.userId.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      request.reason.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.currentPage = 1;
  }

  approveRequest(requestId: string) {
    // Implement approval logic here
    console.log(`Approving request ${requestId}`);
  }

  rejectRequest(requestId: string) {
    // Implement rejection logic here
    console.log(`Rejecting request ${requestId}`);
  }

  protected readonly Math = Math;
}

