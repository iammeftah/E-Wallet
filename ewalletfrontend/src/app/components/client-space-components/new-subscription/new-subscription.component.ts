import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Credit {
  id: number;
  name: string;
  price: number;
  description: string;
}

interface Creditor {
  id: number;
  name: string;
  logo: string;
  credits: Credit[];
}

export interface NewSubscription {
  service: string;
  amount: number;
  frequency: string;
  nextPayment: string;
  status: 'Active' | 'Paused';
}

@Component({
  selector: 'app-new-subscription',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './new-subscription.component.html'
})
export class NewSubscriptionComponent {
  @Output() newSubscriptionCreated = new EventEmitter<NewSubscription>();

  creditors: Creditor[] = [
    {
      id: 1,
      name: 'IAM',
      logo: 'https://seeklogo.com/images/M/maroc-telecom-2006-logo-0957768355-seeklogo.com.png',
      credits: [
        { id: 1, name: 'Basic', price: 99, description: '20GB data, 100 minutes' },
        { id: 2, name: 'Standard', price: 199, description: '50GB data, unlimited minutes' },
        { id: 3, name: 'Premium', price: 299, description: '100GB data, unlimited minutes, international calls' },
      ]
    },
    {
      id: 2,
      name: 'INWI',
      logo: 'https://seeklogo.com/images/I/inwi-logo-B3E61A8F47-seeklogo.com.png',
      credits: [
        { id: 4, name: 'Starter', price: 89, description: '15GB data, 80 minutes' },
        { id: 5, name: 'Pro', price: 189, description: '40GB data, unlimited minutes' },
        { id: 6, name: 'Elite', price: 289, description: '80GB data, unlimited minutes, roaming' },
      ]
    },
    {
      id: 3,
      name: 'Orange',
      logo: 'https://seeklogo.com/images/O/orange-logo-A4FC5976DF-seeklogo.com.png',
      credits: [
        { id: 7, name: 'Light', price: 79, description: '10GB data, 60 minutes' },
        { id: 8, name: 'Plus', price: 179, description: '30GB data, unlimited minutes' },
        { id: 9, name: 'Max', price: 279, description: '70GB data, unlimited minutes, international SMS' },
      ]
    },
  ];

  selectedCreditor: Creditor | null = null;
  selectedCredit: Credit | null = null;
  currentStep: number = 1;

  selectCreditor(creditor: Creditor) {
    this.selectedCreditor = creditor;
    this.selectedCredit = null;
    this.currentStep = 2;
  }

  selectCredit(credit: Credit) {
    this.selectedCredit = credit;
  }

  createSubscription() {
    if (this.isSubscriptionReady()) {
      const newSubscription: NewSubscription = {
        service: `${this.selectedCreditor!.name} - ${this.selectedCredit!.name}`,
        amount: this.selectedCredit!.price,
        frequency: 'Monthly',
        nextPayment: this.getNextPaymentDate(),
        status: 'Active'
      };
      this.newSubscriptionCreated.emit(newSubscription);
      this.resetForm();
    }
  }

  getNextPaymentDate(): string {
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    return nextMonth.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  resetForm() {
    this.selectedCreditor = null;
    this.selectedCredit = null;
    this.currentStep = 1;
  }

  goBack() {
    this.currentStep = 1;
    this.selectedCredit = null;
  }

  getTotalPrice(): number {
    return this.selectedCredit ? this.selectedCredit.price : 0;
  }

  isSubscriptionReady(): boolean {
    return this.selectedCreditor !== null && this.selectedCredit !== null;
  }
}

