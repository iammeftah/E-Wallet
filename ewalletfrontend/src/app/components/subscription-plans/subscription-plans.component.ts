import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Plan {
  name: 'HSSAB1' | 'HSSAB2' | 'HSSAB3';
  description: string;
  price: number;
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
      price: 5,
      features: [
        'Free ATM withdrawals',
        'Online banking',
        'Mobile app access'
      ]
    },
    {
      name: 'HSSAB2',
      description: 'Enhanced account with additional benefits',
      price: 10,
      features: [
        'All HSSAB1 features',
        'Overdraft protection',
        'Higher daily transaction limits'
      ]
    },
    {
      name: 'HSSAB3',
      description: 'Premium account for maximum benefits',
      price: 20,
      features: [
        'All HSSAB2 features',
        'Priority customer service',
        'Travel insurance',
        'Exclusive rewards program'
      ]
    }
  ];

  selectedPlan: 'monthly' | 'annually' = 'monthly';

  selectPlan(plan: Plan) {
    this.planSelected.emit(plan);
    this.planChange.emit(plan.name);
  }
}
