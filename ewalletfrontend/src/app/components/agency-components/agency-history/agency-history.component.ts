import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ActivityLogEntry {
  id: number;
  action: string;
  performedBy: string;
  timestamp: Date;
  details: string;
}

@Component({
  selector: 'app-agency-history',
  templateUrl: './agency-history.component.html',
  styleUrls: ['./agency-history.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class AgencyHistoryComponent implements OnInit {
  activityLog: ActivityLogEntry[] = [];
  filteredLog: ActivityLogEntry[] = [];
  pageSize = 10;
  currentPage = 1;
  searchTerm = '';

  ngOnInit() {
    // Populate with dummy data
    this.activityLog = Array(50).fill(null).map((_, index) => ({
      id: index + 1,
      action: ['Client Added', 'Client Updated', 'Registration Approved', 'Registration Rejected'][Math.floor(Math.random() * 4)],
      performedBy: `Agent ${Math.floor(Math.random() * 10) + 1}`,
      timestamp: new Date(Date.now() - Math.floor(Math.random() * 10000000000)),
      details: `Details for action ${index + 1}`
    }));
    this.filteredLog = [...this.activityLog];
  }

  get paginatedLog() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredLog.slice(startIndex, startIndex + this.pageSize);
  }

  onPageChange(page: number) {
    this.currentPage = page;
  }

  onSearch() {
    this.filteredLog = this.activityLog.filter(entry =>
      entry.action.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      entry.performedBy.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      entry.details.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.currentPage = 1;
  }

  getPaginationArray(): number[] {
    const pageCount = Math.ceil(this.filteredLog.length / this.pageSize);
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
    const pageCount = Math.ceil(this.filteredLog.length / this.pageSize);
    if (this.currentPage < pageCount) {
      this.onPageChange(this.currentPage + 1);
    }
  }

  protected readonly Math = Math;
}

