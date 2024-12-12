import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AgentSignUpData} from '../../../models/auth.model';

@Component({
  selector: 'app-agent-list',
  templateUrl: './agent-list.component.html',
  styleUrls: ['./agent-list.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class AgentListComponent implements OnInit {
  agents: AgentSignUpData[] = [];
  pageSize = 10;
  currentPage = 1;

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
  }

  get paginatedAgents() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.agents.slice(startIndex, startIndex + this.pageSize);
  }

  onPageChange(page: number) {
    this.currentPage = page;
  }

  getPaginationArray(): number[] {
    const pageCount = Math.ceil(this.agents.length / this.pageSize);
    return Array.from({ length: pageCount }, (_, i) => i + 1);
  }

  protected readonly Math = Math;
}
