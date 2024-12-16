import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Creditor {
  id: number;
  name: string;
  logo: string;
}

@Component({
  selector: 'app-donation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './donation.component.html'
})
export class DonationComponent {
  creditors: Creditor[] = [
    { id: 1, name: 'Red Cross', logo: 'https://via.placeholder.com/150?text=Red+Cross' },
    { id: 2, name: 'UNICEF', logo: 'https://via.placeholder.com/150?text=UNICEF' },
    { id: 3, name: 'WWF', logo: 'https://via.placeholder.com/150?text=WWF' },
    { id: 4, name: 'Doctors Without Borders', logo: 'https://via.placeholder.com/150?text=DWB' },
    { id: 5, name: 'Save the Children', logo: 'https://via.placeholder.com/150?text=STC' },
    { id: 6, name: 'Amnesty International', logo: 'https://via.placeholder.com/150?text=Amnesty' },
  ];

  selectedCreditor: Creditor | null = null;
  amount: number = 0;
  motif: string = '';
  currentStep: number = 1;

  selectCreditor(creditor: Creditor) {
    this.selectedCreditor = creditor;
    this.currentStep = 2;
  }

  proceedToCheckout() {
    if (this.selectedCreditor && this.amount > 0) {
      console.log(`Donating ${this.amount} to ${this.selectedCreditor.name}`);
      console.log(`Motif: ${this.motif}`);
      // Implement actual donation logic here
    }
  }

  goBack() {
    this.currentStep = 1;
    this.selectedCreditor = null;
    this.amount = 0;
    this.motif = '';
  }
}

