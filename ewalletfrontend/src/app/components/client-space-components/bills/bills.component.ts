import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {LoaderComponent} from '../../elements/loader/loader.component';

interface Bill {
  creditor: string;
  amount: number;
  dueDate: string;
  status: 'Pending' | 'Paid';
}

@Component({
  selector: 'app-bills',
  standalone: true,
  imports: [CommonModule, LoaderComponent],
  templateUrl: './bills.component.html'
})
export class BillsComponent {
  bills: Bill[] = [
    {
      creditor: 'Electric Company',
      amount: 75.00,
      dueDate: 'Jan 15, 2024',
      status: 'Pending'
    },
    {
      creditor: 'Internet Service',
      amount: 59.99,
      dueDate: 'Jan 20, 2024',
      status: 'Pending'
    },
    {
      creditor: 'Water Utility',
      amount: 45.50,
      dueDate: 'Jan 18, 2024',
      status: 'Paid'
    }
  ];

  isLoading: boolean = false;

  payBill(bill: Bill) {
    this.isLoading = true;
    console.log(`Paying ${bill.amount} to ${bill.creditor}`);
    // Simulate API call
    setTimeout(() => {
      this.isLoading = false;
      bill.status = 'Paid';
    }, 2000);
  }
}
