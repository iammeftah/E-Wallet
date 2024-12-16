import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

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
  imports: [CommonModule],
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

  togglePaymentStatus(payment: RecurringPayment) {
    payment.status = payment.status === 'Active' ? 'Paused' : 'Active';
  }
}

