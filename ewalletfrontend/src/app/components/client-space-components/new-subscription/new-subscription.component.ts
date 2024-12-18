import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoaderComponent } from '../../elements/loader/loader.component';

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
  imports: [CommonModule, FormsModule, LoaderComponent],
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
    {
      id: 4,
      name: 'RADEEMA',
      logo: 'https://www.mapexpress.ma/wp-content/uploads/2020/08/RADEEMA.jpg',
      credits: [
        { id: 10, name: 'Basic', price: 150, description: 'Up to 100 kWh, water included' },
        { id: 11, name: 'Comfort', price: 250, description: 'Up to 200 kWh, water & waste management' },
        { id: 12, name: 'Premium', price: 350, description: 'Unlimited kWh, all utilities included' },
      ]
    },
    {
      id: 5,
      name: 'REDAL',
      logo: '/api/placeholder/150/150',
      credits: [
        { id: 13, name: 'Essential', price: 120, description: 'Basic electricity and water package' },
        { id: 14, name: 'Family', price: 220, description: 'Enhanced utilities package for families' },
        { id: 15, name: 'Business', price: 420, description: 'Commercial utilities package' },
      ]
    },
    {
      id: 6,
      name: 'LYDEC',
      logo: 'https://seeklogo.com/images/L/lydec-logo-89838F3E68-seeklogo.com.png',
      credits: [
        { id: 16, name: 'Basic', price: 140, description: 'Standard utilities package' },
        { id: 17, name: 'Plus', price: 240, description: 'Enhanced service with priority support' },
        { id: 18, name: 'Premium', price: 340, description: 'Complete utilities management' },
      ]
    },
    {
      id: 7,
      name: 'ADM',
      logo: '/api/placeholder/150/150',
      credits: [
        { id: 19, name: 'TAG Basic', price: 100, description: 'Basic toll tag subscription' },
        { id: 20, name: 'TAG Plus', price: 200, description: 'Enhanced toll coverage with discounts' },
        { id: 21, name: 'TAG Fleet', price: 400, description: 'Business fleet toll management' },
      ]
    },
    {
      id: 8,
      name: 'ONCF',
      logo: 'https://seeklogo.com/images/O/oncf-logo-7B6DEB5007-seeklogo.com.png',
      credits: [
        { id: 22, name: 'ZEN', price: 150, description: 'Basic train travel card' },
        { id: 23, name: 'ZEN Plus', price: 250, description: 'Premium train travel with lounge access' },
        { id: 24, name: 'Business', price: 450, description: 'Unlimited first-class travel' },
      ]
    }
  ];

  selectedCreditor: Creditor | null = null;
  selectedCredit: Credit | null = null;
  currentStep: number = 1;
  isLoading: boolean = false;

  // Rest of the component code remains the same...
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
      this.isLoading = true;
      const newSubscription: NewSubscription = {
        service: `${this.selectedCreditor!.name} - ${this.selectedCredit!.name}`,
        amount: this.selectedCredit!.price,
        frequency: 'Monthly',
        nextPayment: this.getNextPaymentDate(),
        status: 'Active'
      };
      // Simulate API call
      setTimeout(() => {
        this.isLoading = false;
        this.newSubscriptionCreated.emit(newSubscription);
        this.resetForm();
      }, 2000);
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
