import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from '../../elements/loader/loader.component';

interface RecurringPayment {
  service: string;
  amount: number;
  frequency: string;
  nextPayment: string;
  status: 'Active' | 'Paused';
}

@Component({
  selector: 'app-recurring-payments',
  standalone: true,
  imports: [CommonModule, LoaderComponent],
  templateUrl: './recurring-payments.component.html'
})
export class RecurringPaymentsComponent {
  payments: RecurringPayment[] = [
    {
      service: 'Netflix Subscription',
      amount: 14.99,
      frequency: 'Monthly',
      nextPayment: 'Jan 1, 2024',
      status: 'Active'
    },
    {
      service: 'Gym Membership',
      amount: 49.99,
      frequency: 'Monthly',
      nextPayment: 'Jan 5, 2024',
      status: 'Active'
    },
    {
      service: 'Cloud Storage',
      amount: 9.99,
      frequency: 'Monthly',
      nextPayment: 'Jan 15, 2024',
      status: 'Paused'
    }
  ];

  isLoading: boolean = false;

  togglePaymentStatus(payment: RecurringPayment) {
    this.isLoading = true;
    // Simulate API call
    setTimeout(() => {
      this.isLoading = false;
      payment.status = payment.status === 'Active' ? 'Paused' : 'Active';
    }, 2000);
  }
}
