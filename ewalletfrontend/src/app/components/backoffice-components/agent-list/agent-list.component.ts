import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgentSignUpData } from '../../../models/auth.model';

@Component({
  selector: 'app-agent-list',
  templateUrl: './agent-list.component.html',
  styleUrls: ['./agent-list.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class AgentListComponent implements OnInit {
  agents: AgentSignUpData[] = [];
  filteredAgents: AgentSignUpData[] = [];
  pageSize = 10;
  currentPage = 1;
  searchTerm = '';

  ngOnInit() {
    // Populate with dummy data matching AgentSignUpData interface
    this.agents = Array(20).fill(null).map((_, index) => ({
      firstName: `FirstName ${index + 1}`,
      lastName: `LastName ${index + 1}`,
      idType: index % 3 === 0 ? 'Passport' : 'CIN',
      idNumber: `ID${1000 + index}`,
      email: `agent${index + 1}@example.com`,
      phone: `+212${6000000 + index}`,
      immatriculation: `IMM${5000 + index}`,
      patentNumber: `PAT${7000 + index}`,
      birthdate: new Date(1990, 0, index + 1).toISOString(),
      address: `Address ${index + 1}`,
      confirmEmail: `agent${index + 1}@example.com`,
      idDocument: null
    }));
    this.filteredAgents = [...this.agents];
  }

  get paginatedAgents() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredAgents.slice(startIndex, startIndex + this.pageSize);
  }

  onPageChange(page: number) {
    this.currentPage = page;
  }

  getPaginationArray(): number[] {
    const pageCount = Math.ceil(this.filteredAgents.length / this.pageSize);
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
    const pageCount = Math.ceil(this.filteredAgents.length / this.pageSize);
    if (this.currentPage < pageCount) {
      this.onPageChange(this.currentPage + 1);
    }
  }

  onSearch() {
    this.filteredAgents = this.agents.filter(agent =>
      agent.firstName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      agent.lastName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      agent.phone.includes(this.searchTerm)
    );
    this.currentPage = 1;
  }

  protected readonly Math = Math;
}

