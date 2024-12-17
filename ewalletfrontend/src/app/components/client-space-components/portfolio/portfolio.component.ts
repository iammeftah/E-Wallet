import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Transaction {
  date: string;
  description: string;
  amount: number;
}

interface VirtualCard {
  id: string;
  cardNumber: string;
  holderName: string;
  expiryDate: string;
  balance: number;
  type: 'visa' | 'mastercard' | 'amex';
  cvv: string;
  cvvVisible: boolean; // Updated property
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

  virtualCards: VirtualCard[] = [
    { id: '1', cardNumber: '4111 1111 1111 1234', holderName: 'JOHN DOE', expiryDate: '12/25', balance: 500, type: 'visa', cvv: '123', cvvVisible: false },
    { id: '2', cardNumber: '5500 0000 0000 0004', holderName: 'JANE SMITH', expiryDate: '06/26', balance: 1000, type: 'mastercard', cvv: '456', cvvVisible: false },
    { id: '3', cardNumber: '3782 822463 10005', holderName: 'ROBERT BROWN', expiryDate: '09/27', balance: 750, type: 'amex', cvv: '789', cvvVisible: false }
  ];

  getCardImage(type: 'visa' | 'mastercard' | 'amex'): string {
    const images = {
      visa: 'https://raw.githubusercontent.com/muhammederdem/credit-card-form/master/src/assets/images/visa.png',
      mastercard: 'https://raw.githubusercontent.com/muhammederdem/credit-card-form/master/src/assets/images/mastercard.png',
      amex: 'https://raw.githubusercontent.com/muhammederdem/credit-card-form/master/src/assets/images/amex.png'
    };
    return images[type];
  }

  maskCardNumber(cardNumber: string): string {
    return 'XXXX XXXX XXXX ' + cardNumber.slice(-4);
  }

  toggleCVV(card: VirtualCard): void {
    card.cvvVisible = !card.cvvVisible; // Updated method
  }

  protected readonly Math = Math;
}

