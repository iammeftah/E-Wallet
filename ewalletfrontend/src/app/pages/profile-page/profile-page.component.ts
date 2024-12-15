import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { User, Client, Agent, Admin } from '../../models/auth.model';
import { CommonModule } from '@angular/common';
import {HeaderComponent} from '../../components/layout/header/header.component';

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

  constructor(
    private formBuilder: FormBuilder
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
    this.user = new Agent({
      id: '2',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      phone: '9876543210',
      role: 'agent',
      idType: 'Passport',
      idNumber: 'P123456',
      birthdate: '1985-05-15',
      address: '123 Agent St, City',
      immatriculation: 'AG12345',
      patentNumber: 'PT98765'
    });

    this.updateFormWithUserData();
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
    }
  }

  changePassword() {
    if (this.passwordForm.valid) {
      console.log('Password changed:', this.passwordForm.value);
      alert('Password changed successfully');
      this.passwordForm.reset();
    }
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

  viewTransactions() {
    if (this.user && this.isClient(this.user)) {
      console.log('Viewing transactions for client:', this.user.id);
      alert('Viewing transactions (not implemented)');
    }
  }
}

