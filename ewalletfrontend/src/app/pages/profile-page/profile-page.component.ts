import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { User, Client, Agent, Admin } from '../../models/auth.model';
import { AuthService } from '../../services/auth.service';
import { catchError, of } from 'rxjs';
import { finalize } from 'rxjs/operators';
import {CurrencyPipe, DatePipe, NgClass, NgIf, TitleCasePipe} from '@angular/common';
import {HeaderComponent} from '../../components/layout/header/header.component';

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
  imports: [
    NgIf,
    ReactiveFormsModule,
    NgClass,
    CurrencyPipe,
    TitleCasePipe,
    HeaderComponent
  ],
  providers: [DatePipe]
})
export class ProfilePageComponent implements OnInit {
  user: User | undefined;
  isEditing = false;
  isLoading = false;
  error: string | null = null;
  profileForm!: FormGroup;
  passwordForm!: FormGroup;

  lastTransaction: Transaction | undefined;
  recentTransactions: Transaction[] = [];
  totalUsers: number = 0;
  activeAgents: number = 0;
  recentActivities: SystemActivity[] = [];
  showChangePasswordModal = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private datePipe: DatePipe
  ) {
    this.initializeForms();
  }

  private initializeForms() {
    this.profileForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required]
    });

    this.passwordForm = this.formBuilder.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      ]],
      confirmNewPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.isLoading = true;
    this.error = null;

    this.authService.getUserProfile().pipe(
      catchError(error => {
        this.error = error.message || 'Failed to load user profile';
        return of(null);
      }),
      finalize(() => {
        this.isLoading = false;
        this.cdr.detectChanges();
      })
    ).subscribe(user => {
      if (user) {
        this.user = user;
        this.updateFormWithUserData();
        this.loadUserSpecificData();
      }
    });
  }

  private updateFormWithUserData(): void {
    if (this.user) {
      this.profileForm.patchValue({
        firstName: this.user.firstName,
        lastName: this.user.lastName,
        email: this.user.email,
        phone: this.user.phone
      });
    }
  }

  private loadUserSpecificData(): void {
    if (this.isClient(this.user)) {
      this.loadClientData();
    } else if (this.isAgent(this.user)) {
      this.loadAgentData();
    } else if (this.isAdmin(this.user)) {
      this.loadAdminData();
    }
  }

  private loadClientData(): void {
    if (this.isClient(this.user)) {
      // TODO: Fetch real client data from the backend
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

  private loadAgentData(): void {
    // TODO: Implement agent-specific data loading
  }

  private loadAdminData(): void {
    if (this.isAdmin(this.user)) {
      // TODO: Fetch real admin data from the backend
      this.totalUsers = 1000;
      this.activeAgents = 50;
      this.recentActivities = [
        { date: new Date(), description: 'New user registration' },
        { date: new Date(Date.now() - 3600000), description: 'System update completed' },
        { date: new Date(Date.now() - 7200000), description: 'Suspicious activity detected' },
      ];
    }
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      this.updateFormWithUserData();
    }
  }

  saveProfile(): void {
    if (this.profileForm.valid && this.user) {
      this.isLoading = true;
      this.error = null;

      const updatedUser = { ...this.user, ...this.profileForm.value };

      this.authService.updateUserProfile(updatedUser).pipe(
        catchError(error => {
          this.error = error.message || 'Failed to update profile';
          return of(null);
        }),
        finalize(() => {
          this.isLoading = false;
          this.cdr.detectChanges();
        })
      ).subscribe(user => {
        if (user) {
          this.user = user;
          this.isEditing = false;
          alert('Profile updated successfully');
        }
      });
    }
  }

  changePassword(): void {
    if (this.passwordForm.valid) {
      this.isLoading = true;
      this.error = null;

      const { currentPassword, newPassword } = this.passwordForm.value;

      this.authService.changePassword(currentPassword, newPassword).pipe(
        catchError(error => {
          this.error = error.message || 'Failed to change password';
          return of(null);
        }),
        finalize(() => {
          this.isLoading = false;
          this.cdr.detectChanges();
        })
      ).subscribe(response => {
        if (response !== null) {
          this.passwordForm.reset();
          this.closeChangePasswordModal();
          alert('Password changed successfully');
        }
      });
    }
  }

  openChangePasswordModal(): void {
    this.showChangePasswordModal = true;
  }

  closeChangePasswordModal(): void {
    this.showChangePasswordModal = false;
    this.passwordForm.reset();
  }

  private passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword');
    const confirmNewPassword = form.get('confirmNewPassword');

    return newPassword?.value === confirmNewPassword?.value
      ? null
      : { passwordMismatch: true };
  }

  isClient(user: User | undefined): user is Client {
    return user?.role === 'CLIENT';
  }

  isAgent(user: User | undefined): user is Agent {
    return user?.role === 'AGENT';
  }

  isAdmin(user: User | undefined): user is Admin {
    return user?.role === 'ADMIN';
  }

  formatDate(date: string): string {
    return this.datePipe.transform(date, 'medium') || '';
  }

  viewAllTransactions(): void {
    if (this.user && this.isClient(this.user)) {
      console.log('Viewing all transactions for client:', this.user.id);
      alert('Viewing all transactions (not implemented)');
    }
  }
}
