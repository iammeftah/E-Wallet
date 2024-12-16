import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Transaction {
  date: string;
  description: string;
  amount: number;
}

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './portfolio.component.html'
})
export class PortfolioComponent {
  balance: number = 5000.00;
  lastTransaction: { amount: number; date: string } = {
    amount: -150.00,
    date: '12/16/24, 12:14 AM'
  };

  recentTransactions: Transaction[] = [
    { date: '12/16/24, 12:14 AM', description: 'Salary Deposit', amount: 3000.00 },
    { date: '12/15/24, 12:14 AM', description: 'Grocery Shopping', amount: -75.00 },
    { date: '12/14/24, 12:14 AM', description: 'Online Transfer', amount: -200.00 }
  ];
  protected readonly Math = Math;
}

