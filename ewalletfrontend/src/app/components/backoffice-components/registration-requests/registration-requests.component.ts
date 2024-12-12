import { Component, OnInit, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgentSignUpData } from '../../../models/auth.model';
import AOS from 'aos';
import 'aos/dist/aos.css';

@Component({
  selector: 'app-registration-requests',
  templateUrl: './registration-requests.component.html',
  styleUrls: ['./registration-requests.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class RegistrationRequestsComponent implements OnInit {
  registrationRequests: AgentSignUpData[] = [];
  pageSize = 10;
  currentPage = 1;
  selectedRequest: AgentSignUpData | null = null;

  ngOnInit() {
    // Initialize AOS
    AOS.init({
      duration: 300,
      easing: 'ease-in-out'
    });

    // Populate with dummy registration requests
    this.registrationRequests = Array(20).fill(null).map((_, index) => ({
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
      idDocument: index % 2 === 0 ? new File([], `id-document-${index + 1}.pdf`) : null
    }));
  }

  get paginatedRequests() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.registrationRequests.slice(startIndex, startIndex + this.pageSize);
  }

  onPageChange(page: number) {
    this.currentPage = page;
  }

  getPaginationArray(): number[] {
    const pageCount = Math.ceil(this.registrationRequests.length / this.pageSize);
    return Array.from({ length: pageCount }, (_, i) => i + 1);
  }

  openRequestModal(request: AgentSignUpData) {
    this.selectedRequest = request;
  }

  closeRequestModal(event: MouseEvent) {
    // Close modal when clicking outside the modal content
    if ((event.target as HTMLElement).classList.contains('fixed')) {
      this.selectedRequest = null;
    }
  }

  onAcceptRequest(request: AgentSignUpData) {
    // TODO: Implement actual acceptance logic
    console.log('Accepting request:', request);
    this.registrationRequests = this.registrationRequests.filter(r => r !== request);
    this.selectedRequest = null;
  }

  onRejectRequest(request: AgentSignUpData) {
    // TODO: Implement actual rejection logic
    console.log('Rejecting request:', request);
    this.registrationRequests = this.registrationRequests.filter(r => r !== request);
    this.selectedRequest = null;
  }

  viewDocument(document: File | null) {
    if (document) {
      // Implement document viewing logic
      console.log('Viewing document:', document.name);
    } else {
      console.log('No document available');
    }
  }

  protected readonly Math = Math;
}
