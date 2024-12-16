import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Plan {
  name: 'HSSAB1' | 'HSSAB2' | 'HSSAB3';
  description: string;
  monthlyPrice: number;
  features: string[];
}

@Component({
  selector: 'app-subscription-plans',
  templateUrl: './subscription-plans.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class SubscriptionPlansComponent {
  @Output() planSelected = new EventEmitter<Plan>();
  @Output() planChange = new EventEmitter<'HSSAB1' | 'HSSAB2' | 'HSSAB3'>();

  plans: Plan[] = [
    {
      name: 'HSSAB1',
      description: 'Basic account for everyday banking',
      monthlyPrice: 5,
      features: [
        'Free ATM withdrawals',
        'Online banking',
        'Mobile app access',
        'Basic customer support',
        'Monthly account statement',
        'Debit card included'
      ]
    },
    {
      name: 'HSSAB2',
      description: 'Enhanced account with additional benefits',
      monthlyPrice: 10,
      features: [
        'All HSSAB1 features',
        'Overdraft protection',
        'Higher daily transaction limits',
        'Cashback on debit card purchases',
        'Free foreign currency exchanges',
        'Priority customer support',
        'Quarterly investment newsletter'
      ]
    },
    {
      name: 'HSSAB3',
      description: 'Premium account for maximum benefits',
      monthlyPrice: 20,
      features: [
        'All HSSAB2 features',
        'Priority customer service',
        'Travel insurance',
        'Exclusive rewards program',
        'Unlimited free international transfers',
        'Personalized financial advice',
        'Concierge services',
        'Access to exclusive events',
        'Premium metal card'
      ]
    }
  ];

  selectedPlan: 'monthly' | 'annually' = 'monthly';

  getPrice(plan: Plan): number {
    if (this.selectedPlan === 'monthly') {
      return plan.monthlyPrice;
    } else {
      // Annual price = (monthly_price * 0.9) * 12
      return Math.round((plan.monthlyPrice * 0.9) * 12);
    }
  }

  getSavings(plan: Plan): number {
    const regularAnnualPrice = plan.monthlyPrice * 12;
    const discountedAnnualPrice = this.getPrice(plan);
    return regularAnnualPrice - discountedAnnualPrice;
  }

  selectPlan(plan: Plan) {
    this.planSelected.emit(plan);
    this.planChange.emit(plan.name);
  }
}
