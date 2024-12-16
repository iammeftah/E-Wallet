import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface MerchantPartner {
  name: string;
  offer: string;
  category: string;
  validUntil: string;
}

@Component({
  selector: 'app-merchant-partners',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './merchant-partners.component.html'
})
export class MerchantPartnersComponent {
  merchants: MerchantPartner[] = [
    {
      name: 'SuperMart',
      offer: '5% cashback on all purchases',
      category: 'Retail',
      validUntil: 'Dec 31, 2024'
    },
    {
      name: 'TechGadgets',
      offer: 'Free shipping on orders over $50',
      category: 'Electronics',
      validUntil: 'Jan 31, 2024'
    },
    {
      name: 'FashionHub',
      offer: '10% discount for our bank customers',
      category: 'Fashion',
      validUntil: 'Mar 15, 2024'
    }
  ];

  viewOffers(merchant: string) {
    console.log(`Viewing offers for ${merchant}`);
  }
}

