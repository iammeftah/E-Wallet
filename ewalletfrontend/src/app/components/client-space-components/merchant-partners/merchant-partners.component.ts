import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface MerchantPartner {
  name: string;
  offer: string;
  category: string;
  validUntil: string;
}

interface Product {
  name: string;
  description: string;
  price: number;
  image: string;
}

@Component({
  selector: 'app-merchant-partners',
  standalone: true,
  imports: [CommonModule, FormsModule],
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

  selectedMerchant: MerchantPartner | null = null;
  serieNumber: string = '';
  currentStep: 'enterCode' | 'productDisplay' | 'paymentComplete' = 'enterCode';
  selectedProduct: Product | null = null;
  isLoading: boolean = false;

  openModal(merchant: MerchantPartner) {
    this.selectedMerchant = merchant;
    this.currentStep = 'enterCode';
    this.serieNumber = '';
  }

  closeModal() {
    this.selectedMerchant = null;
    this.serieNumber = '';
    this.currentStep = 'enterCode';
    this.selectedProduct = null;
    this.isLoading = false;
  }

  scanQRCode() {
    console.log('Scanning QR Code');
    // Implement QR code scanning logic here
    // For demonstration, we'll just set a dummy serie number
    this.serieNumber = 'QR12345';
  }

  nextStep() {
    if (this.currentStep === 'enterCode' && this.serieNumber) {
      this.currentStep = 'productDisplay';
      this.fetchProduct();
    }
  }

  backStep() {
    if (this.currentStep === 'productDisplay') {
      this.currentStep = 'enterCode';
    } else if (this.currentStep === 'paymentComplete') {
      this.currentStep = 'productDisplay';
    }
  }

  fetchProduct() {
    // Simulating API call to fetch product based on serie number
    // In a real application, you would make an HTTP request here
    this.selectedProduct = {
      name: 'Premium Gadget',
      description: 'The latest tech gadget with amazing features.',
      price: 299.99,
      image: 'https://via.placeholder.com/300x200'
    };
  }

  payNow() {
    this.isLoading = true;
    console.log('Processing payment for:', this.selectedProduct);
    // Simulate API call for payment processing
    setTimeout(() => {
      this.isLoading = false;
      this.currentStep = 'paymentComplete';
      console.log('Payment completed');
    }, 2000); // Simulating a 2-second payment process
  }
}

