import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {LoaderComponent} from '../../elements/loader/loader.component';

interface RecentRecipient {
  firstName: string;
  lastName: string;
  avatar: string;
}

@Component({
  selector: 'app-send-money',
  standalone: true,
  imports: [CommonModule, FormsModule, LoaderComponent],
  templateUrl: './send-money.component.html'
})
export class SendMoneyComponent {
  receiverFirstName: string = '';
  receiverLastName: string = '';
  amount: number = 0;
  note: string = '';
  selectedCurrency: string = 'USD';
  currencies: string[] = ['USD', 'EUR', 'GBP', 'JPY'];
  isLoading: boolean = false;

  recentRecipients: RecentRecipient[] = [
    { firstName: 'Alice', lastName: 'Johnson', avatar: 'https://i.pravatar.cc/150?img=1' },
    { firstName: 'Bob', lastName: 'Smith', avatar: 'https://i.pravatar.cc/150?img=2' },
    { firstName: 'Carol', lastName: 'Williams', avatar: 'https://i.pravatar.cc/150?img=3' },
    { firstName: 'Carol', lastName: 'Williams', avatar: 'https://i.pravatar.cc/150?img=4' },
    { firstName: 'Carol', lastName: 'Williams', avatar: 'https://i.pravatar.cc/150?img=5' },
    { firstName: 'Carol', lastName: 'Williams', avatar: 'https://i.pravatar.cc/150?img=6' },
    { firstName: 'Carol', lastName: 'Williams', avatar: 'https://i.pravatar.cc/150?img=7' },
    { firstName: 'Carol', lastName: 'Williams', avatar: 'https://i.pravatar.cc/150?img=8' },
    { firstName: 'Carol', lastName: 'Williams', avatar: 'https://i.pravatar.cc/150?img=9' },
    { firstName: 'Carol', lastName: 'Williams', avatar: 'https://i.pravatar.cc/150?img=10' },
    { firstName: 'Carol', lastName: 'Williams', avatar: 'https://i.pravatar.cc/150?img=11' },
    { firstName: 'Carol', lastName: 'Williams', avatar: 'https://i.pravatar.cc/150?img=12' },
  ];

  sendMoney() {
    this.isLoading = true;
    const fullName = `${this.receiverFirstName} ${this.receiverLastName}`.trim();
    console.log(`Sending ${this.amount} ${this.selectedCurrency} to ${fullName}`);
    // Simulate API call
    setTimeout(() => {
      this.isLoading = false;
      // Implement the actual logic to send money
    }, 2000);
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
