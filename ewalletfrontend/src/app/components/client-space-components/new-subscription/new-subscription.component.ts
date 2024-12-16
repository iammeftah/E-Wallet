import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Creditor {
  id: number;
  name: string;
  logo: string;
  monthlyFee: number;
}

@Component({
  selector: 'app-new-subscription',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './new-subscription.component.html'
})
export class NewSubscriptionComponent {
  creditors: Creditor[] = [
    { id: 1, name: 'Netflix', logo: 'https://via.placeholder.com/50?text=NF', monthlyFee: 14.99 },
    { id: 2, name: 'Spotify', logo: 'https://via.placeholder.com/50?text=SP', monthlyFee: 9.99 },
    { id: 3, name: 'Amazon Prime', logo: 'https://via.placeholder.com/50?text=AP', monthlyFee: 12.99 },
  ];

  selectedCreditor: Creditor | null = null;
  paymentMethod: string = '';
  billingDate: string = '';

  selectCreditor(creditor: Creditor) {
    this.selectedCreditor = creditor;
  }

  createSubscription() {
    if (this.selectedCreditor && this.paymentMethod && this.billingDate) {
      console.log(`Creating subscription for ${this.selectedCreditor.name}`);
      console.log(`Payment Method: ${this.paymentMethod}`);
      console.log(`Billing Date: ${this.billingDate}`);
      // Implement actual subscription creation logic here
    }
  }
}

