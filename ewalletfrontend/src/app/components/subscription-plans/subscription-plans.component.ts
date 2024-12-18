import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoaderComponent } from '../elements/loader/loader.component';

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
  imports: [CommonModule, FormsModule, ReactiveFormsModule, LoaderComponent]
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
  isLoading: boolean = false;
  showModal: boolean = false;
  currentPlanName: Plan['name'] = 'HSSAB1'; // Track current plan
  selectedPlanName: Plan['name'] | null = null; // Track selected plan in modal
  upgradeForm: FormGroup;
  idTypes: string[] = ['CIN', 'Passport', 'Residence Permit'];
  idDocumentCount: number = 1;

  constructor(private fb: FormBuilder) {
    this.upgradeForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      idType: ['', Validators.required],
      idDocument: [null, Validators.required],
      idDocumentBack: [null],
      incomeProof: [null]
    });

    this.upgradeForm.get('idType')?.valueChanges.subscribe((idType: string) => {
      this.idDocumentCount = (idType === 'Passport') ? 1 : 2;
      if (this.idDocumentCount === 2) {
        this.upgradeForm.get('idDocumentBack')?.setValidators([Validators.required]);
      } else {
        this.upgradeForm.get('idDocumentBack')?.clearValidators();
      }
      this.upgradeForm.get('idDocumentBack')?.updateValueAndValidity();
    });
  }

  getPrice(plan: Plan): number {
    if (this.selectedPlan === 'monthly') {
      return plan.monthlyPrice;
    } else {
      return Math.round((plan.monthlyPrice * 0.9) * 12);
    }
  }

  getSavings(plan: Plan): number {
    const regularAnnualPrice = plan.monthlyPrice * 12;
    const discountedAnnualPrice = this.getPrice(plan);
    return regularAnnualPrice - discountedAnnualPrice;
  }

  selectPlan(plan: Plan) {
    if (plan.name === this.currentPlanName) {
      return; // Don't do anything if the selected plan is the current plan
    }

    this.showModal = true;
    this.selectedPlanName = plan.name;

    // Reset form when opening modal
    this.upgradeForm.reset();

    if (plan.name === 'HSSAB3') {
      this.upgradeForm.get('incomeProof')?.setValidators([Validators.required]);
    } else {
      this.upgradeForm.get('incomeProof')?.clearValidators();
    }
    this.upgradeForm.get('incomeProof')?.updateValueAndValidity();

    if (plan.name === 'HSSAB1') {
      this.upgradeForm.disable();
    } else {
      this.upgradeForm.enable();
    }
  }

  upgradePlan(plan: Plan) {
    // Additional validation before proceeding
    if (plan.name !== 'HSSAB1' && !this.upgradeForm.valid) {
      return;
    }

    this.isLoading = true;
    // Simulate API call
    setTimeout(() => {
      this.isLoading = false;
      this.currentPlanName = plan.name; // Update current plan only after successful upgrade
      this.selectedPlanName = null; // Reset selected plan
      this.planSelected.emit(plan);
      this.planChange.emit(plan.name);
      this.showModal = false;
      this.upgradeForm.reset();
    }, 2000);
  }

  onUpgradeSubmit() {
    if (this.selectedPlanName === null) {
      return;
    }

    if (this.selectedPlanName === 'HSSAB1' || this.upgradeForm.valid) {
      const selectedPlan = this.plans.find(p => p.name === this.selectedPlanName);
      if (selectedPlan) {
        this.upgradePlan(selectedPlan);
      }
    }
  }

  closeModal() {
    this.showModal = false;
    this.upgradeForm.reset();
    this.selectedPlanName = null; // Reset selected plan on modal close
  }

  onFileChange(event: any, fileType: 'idDocument' | 'idDocumentBack' | 'incomeProof') {
    const file = event.target.files[0];
    this.upgradeForm.patchValue({
      [fileType]: file
    });
  }

  isCurrentPlan(planName: Plan['name']): boolean {
    return this.currentPlanName === planName;
  }

  getButtonText(planName: Plan['name']): string {
    return this.isCurrentPlan(planName) ? 'Current Plan' : `Upgrade to ${planName}`;
  }
}
