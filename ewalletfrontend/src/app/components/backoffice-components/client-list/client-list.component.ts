import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientSignUpData } from '../../../models/auth.model';

@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ClientListComponent implements OnInit {
  clients: ClientSignUpData[] = [];
  filteredClients: ClientSignUpData[] = [];
  pageSize = 10;
  currentPage = 1;
  searchTerm = '';

  ngOnInit() {
    // Populate with dummy data matching ClientSignUpData interface
    this.clients = Array(20).fill(null).map((_, index) => ({
      clientType: index % 3 === 0 ? 'HSSAB1' : index % 3 === 1 ? 'HSSAB2' : 'HSSAB3',
      firstName: `FirstName ${index + 1}`,
      lastName: `LastName ${index + 1}`,
      phone: `+212${6000000 + index}`,
      email: `client${index + 1}@example.com`,
      idType: index % 3 === 0 ? 'CIN' : 'Passport',
      idNumber: `ID${1000 + index}`,
      idDocument: null,
      incomeProof: null
    }));
    this.filteredClients = [...this.clients];
  }

  get paginatedClients() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredClients.slice(startIndex, startIndex + this.pageSize);
  }

  onPageChange(page: number) {
    this.currentPage = page;
  }

  getPaginationArray(): number[] {
    const pageCount = Math.ceil(this.filteredClients.length / this.pageSize);
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
    const pageCount = Math.ceil(this.filteredClients.length / this.pageSize);
    if (this.currentPage < pageCount) {
      this.onPageChange(this.currentPage + 1);
    }
  }

  onSearch() {
    this.filteredClients = this.clients.filter(client =>
      client.firstName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      client.lastName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      client.phone.includes(this.searchTerm)
    );
    this.currentPage = 1;
  }

  protected readonly Math = Math;
}

