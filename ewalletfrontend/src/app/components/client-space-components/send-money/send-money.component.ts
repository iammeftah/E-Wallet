import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface RecentRecipient {
  firstName: string;
  lastName: string;
  avatar: string;
}

@Component({
  selector: 'app-send-money',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './send-money.component.html'
})
export class SendMoneyComponent {
  receiverFirstName: string = '';
  receiverLastName: string = '';
  amount: number = 0;
  note: string = '';
  selectedCurrency: string = 'USD';
  currencies: string[] = ['USD', 'EUR', 'GBP', 'JPY'];

  recentRecipients: RecentRecipient[] = [
    { firstName: 'Alice', lastName: 'Johnson', avatar: 'https://i.pravatar.cc/150?img=1' },
    { firstName: 'Bob', lastName: 'Smith', avatar: 'https://i.pravatar.cc/150?img=2' },
    { firstName: 'Carol', lastName: 'Williams', avatar: 'https://i.pravatar.cc/150?img=3' },
  ];

  sendMoney() {
    const fullName = `${this.receiverFirstName} ${this.receiverLastName}`.trim();
    console.log(`Sending ${this.amount} ${this.selectedCurrency} to ${fullName}`);
    // Implement the logic to send money
  }

  selectRecipient(recipient: RecentRecipient) {
    this.receiverFirstName = recipient.firstName;
    this.receiverLastName = recipient.lastName;
  }

  clearForm() {
    this.receiverFirstName = '';
    this.receiverLastName = '';
    this.amount = 0;
    this.note = '';
  }
}

