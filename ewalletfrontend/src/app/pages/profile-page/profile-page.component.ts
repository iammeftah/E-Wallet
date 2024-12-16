import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { User, Client, Agent, Admin } from '../../models/auth.model';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../components/layout/header/header.component';

interface Transaction {
  date: Date;
  description: string;
  amount: number;
}

interface SystemActivity {
  date: Date;
  description: string;
}

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HeaderComponent]
})
export class ProfilePageComponent implements OnInit {
  user: User | undefined;
  isEditing = false;
  profileForm: FormGroup;
  passwordForm: FormGroup;
  lastTransaction: Transaction | undefined;
  recentTransactions: Transaction[] = [];
  totalUsers: number = 0;
  activeAgents: number = 0;
  recentActivities: SystemActivity[] = [];
  showChangePasswordModal = false;
  showSubscriptionPlans = false;

  constructor(
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.profileForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required]
    });

    this.passwordForm = this.formBuilder.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmNewPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    // Mock user data
    this.user = new Client({
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '1234567890',
      role: 'client',
      clientType: 'HSSAB1',
      idType: 'Passport',
      idNumber: 'AB123456',
      balance: 5000
    });

    this.updateFormWithUserData();
    this.loadUserSpecificData();
  }

  private updateFormWithUserData() {
    if (this.user) {
      this.profileForm.patchValue({
        firstName: this.user.firstName,
        lastName: this.user.lastName,
        email: this.user.email,
        phone: this.user.phone
      });
    }
  }

  private loadUserSpecificData() {
    if (this.isClient(this.user)) {
      this.loadClientData();
    } else if (this.isAgent(this.user)) {
      this.loadAgentData();
    } else if (this.isAdmin(this.user)) {
      this.loadAdminData();
    }
  }

  private loadClientData() {
    if (this.isClient(this.user)) {
      // Mock client-specific data
      this.lastTransaction = {
        date: new Date(),
        description: 'Online Purchase',
        amount: -150
      };

      this.recentTransactions = [
        { date: new Date(), description: 'Salary Deposit', amount: 3000 },
        { date: new Date(Date.now() - 86400000), description: 'Grocery Shopping', amount: -75 },
        { date: new Date(Date.now() - 172800000), description: 'Online Transfer', amount: -200 },
      ];
    }
  }

  private loadAgentData() {
    // Mock agent-specific data (if needed)
  }

  private loadAdminData() {
    if (this.isAdmin(this.user)) {
      // Mock admin-specific data
      this.totalUsers = 1000;
      this.activeAgents = 50;
      this.recentActivities = [
        { date: new Date(), description: 'New user registration' },
        { date: new Date(Date.now() - 3600000), description: 'System update completed' },
        { date: new Date(Date.now() - 7200000), description: 'Suspicious activity detected' },
      ];
    }
  }

  private passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword');
    const confirmNewPassword = form.get('confirmNewPassword');

    return newPassword?.value === confirmNewPassword?.value
      ? null
      : { passwordMismatch: true };
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      this.updateFormWithUserData();
    }
  }

  saveProfile() {
    if (this.profileForm.valid && this.user) {
      Object.assign(this.user, this.profileForm.value);
      this.isEditing = false;
      console.log('Profile updated:', this.user);
      alert('Profile updated successfully');
      this.cdr.detectChanges();
    }
  }

  changePassword() {
    if (this.passwordForm.valid) {
      console.log('Password changed:', this.passwordForm.value);
      alert('Password changed successfully');
      this.passwordForm.reset();
      this.closeChangePasswordModal();
      this.cdr.detectChanges();
    }
  }

  openChangePasswordModal() {
    this.showChangePasswordModal = true;
  }

  closeChangePasswordModal() {
    this.showChangePasswordModal = false;
    this.passwordForm.reset();
  }

  isClient(user: User | undefined): user is Client {
    return user?.role === 'client';
  }

  isAgent(user: User | undefined): user is Agent {
    return user?.role === 'agent';
  }

  isAdmin(user: User | undefined): user is Admin {
    return user?.role === 'admin';
  }

  viewAllTransactions() {
    if (this.user && this.isClient(this.user)) {
      console.log('Viewing all transactions for client:', this.user.id);
      alert('Viewing all transactions (not implemented)');
    }
  }

  toggleSubscriptionPlans() {
    this.showSubscriptionPlans = !this.showSubscriptionPlans;
  }

  handlePlanChange(planName: 'HSSAB1' | 'HSSAB2' | 'HSSAB3') {
    if (this.user && this.isClient(this.user)) {
      this.user.clientType = planName;
      console.log(`Changed plan to: ${planName}`);
      alert(`Plan changed to ${planName}`);
      this.cdr.detectChanges();
    }
  }
}
