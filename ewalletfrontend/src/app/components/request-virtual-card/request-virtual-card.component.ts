import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {LoaderComponent} from '../elements/loader/loader.component';

interface CardType {
  id: string;
  name: string;
  image: string;
}

@Component({
  selector: 'app-request-virtual-card',
  standalone: true,
  imports: [CommonModule, FormsModule, LoaderComponent],
  templateUrl: './request-virtual-card.component.html'
})
export class RequestVirtualCardComponent {
  cardRequest = {
    name: '',
    email: '',
    cardType: '',
    initialBalance: 0
  };

  cardTypes: CardType[] = [
    { id: 'visa', name: 'Visa', image: 'https://raw.githubusercontent.com/muhammederdem/credit-card-form/master/src/assets/images/visa.png' },
    { id: 'mastercard', name: 'Mastercard', image: 'https://raw.githubusercontent.com/muhammederdem/credit-card-form/master/src/assets/images/mastercard.png' },
    { id: 'amex', name: 'American Express', image: 'https://raw.githubusercontent.com/muhammederdem/credit-card-form/master/src/assets/images/amex.png' }
  ];

  selectedCard: CardType | null = null;
  isLoading: boolean = false;

  selectCard(card: CardType) {
    this.selectedCard = card;
    this.cardRequest.cardType = card.id;
  }

  onSubmit() {
    this.isLoading = true;
    console.log('Card request submitted:', this.cardRequest);
    console.log('Selected card:', this.selectedCard);
    // Simulate API call
    setTimeout(() => {
      this.isLoading = false;
      // Here you would typically send this data to your backend
    }, 2000);
  }
}
