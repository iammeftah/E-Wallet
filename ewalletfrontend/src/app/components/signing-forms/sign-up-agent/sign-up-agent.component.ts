import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { OtpVerificationComponent } from '../../elements/otp-verification/otp-verification.component';
import { LoaderComponent } from '../../elements/loader/loader.component';
import { AgentSignUpData } from '../../../models/auth.model';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up-agent',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, OtpVerificationComponent, LoaderComponent],
  templateUrl: './sign-up-agent.component.html',
  styleUrls: ['./sign-up-agent.component.css']
})
export class SignUpAgentComponent implements OnInit {
  signUpForm: FormGroup;
  currentStep = 1;
  totalSteps = 4;
  steps = ['Personal Info', 'Contact', 'Identity', 'Professional'];

  isIdTypeDropdownOpen = false;

  idTypes: string[] = ['CIN', 'Passport', 'Residence permit'];
  idDocumentCount: number = 1;

  showOtpVerification = false;
  phoneNumber = '';
  isLoading = false;


  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    // Remove birthdate and address since they're not in the template
    this.signUpForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      confirmEmail: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      idType: ['', Validators.required],
      idNumber: ['', [Validators.required, Validators.minLength(5)]],
      immatriculation: ['', [Validators.required, Validators.minLength(5)]],
      patentNumber: ['', [Validators.required, Validators.minLength(5)]],
      idDocumentFront: [null, Validators.required],
      idDocumentBack: [null]
    });

    // Add email match validator
    this.signUpForm.get('confirmEmail')?.valueChanges.subscribe(() => {
      const email = this.signUpForm.get('email')?.value;
      const confirmEmail = this.signUpForm.get('confirmEmail')?.value;

      if (email !== confirmEmail) {
        this.signUpForm.get('confirmEmail')?.setErrors({ notMatch: true });
      } else {
        const confirmEmailControl = this.signUpForm.get('confirmEmail');
        const errors = { ...confirmEmailControl?.errors };
        delete errors['notMatch'];
        confirmEmailControl?.setErrors(Object.keys(errors).length ? errors : null);
      }
    });

    this.signUpForm.get('idType')?.valueChanges.subscribe(() => {
      this.updateIdDocumentCount();
      this.updateIdDocumentValidators();
    });
  }

  ngOnInit() {}

  emailMatchValidator(group: FormGroup) {
    const email = group.get('email')?.value;
    const confirmEmail = group.get('confirmEmail')?.value;
    return email === confirmEmail ? null : { emailMismatch: true };
  }

  nextStep() {
    if (this.isCurrentStepValid()) {
      if (this.currentStep < this.totalSteps) {
        this.currentStep++;
      }
    } else {
      console.log('Current step is invalid. Displaying validation errors.');
      this.markFormGroupTouched(this.signUpForm);
    }
  }

  isCurrentStepValid(): boolean {
    const currentStepControls = this.getControlsForCurrentStep();
    let isValid = true;

    currentStepControls.forEach(controlName => {
      const control = this.signUpForm.get(controlName);
      if (control && !control.valid) {
        control.markAsTouched();
        isValid = false;
      }
    });

    return isValid;
  }
  getControlsForCurrentStep(): string[] {
    switch (this.currentStep) {
      case 1:
        return ['firstName', 'lastName'];
      case 2:
        return ['email', 'confirmEmail', 'phone'];
      case 3:
        const idControls = ['idType', 'idNumber', 'idDocumentFront'];
        if (this.idDocumentCount === 2) {
          idControls.push('idDocumentBack');
        }
        return idControls;
      case 4:
        return ['immatriculation', 'patentNumber'];
      default:
        return [];
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  requestId: string | null = null;
  registrationStatus: 'PENDING' | 'ACCEPTED' | 'DECLINED' | null = null;

  onSubmit() {
    if (this.signUpForm.valid) {
      this.isLoading = true;
      const formData: AgentSignUpData = this.signUpForm.value;

      this.authService.registerAgent(formData).subscribe({
        next: (response) => {
          this.requestId = response.id;
          this.registrationStatus = 'PENDING';
          // Show success message to user
          console.log('Registration request submitted successfully');
          this.isLoading = false;

          // Start polling for status (optional)
          this.pollRegistrationStatus();
        },
        error: (error) => {
          console.error('Registration request failed:', error);
          this.isLoading = false;
          // Show error message to user
        }
      });
    } else {
      console.log('Form is invalid. Displaying validation errors.');
      this.markFormGroupTouched(this.signUpForm);
    }
  }

  private pollRegistrationStatus() {
    if (!this.requestId) return;

    const pollInterval = setInterval(() => {
      this.authService.checkRegistrationStatus(this.requestId!).subscribe({
        next: (response) => {
          this.registrationStatus = response.status;

          if (response.status === 'ACCEPTED' || response.status === 'DECLINED') {
            clearInterval(pollInterval);

            if (response.status === 'ACCEPTED') {
              this.showOtpVerification = true;
              this.phoneNumber = this.signUpForm.get('phone')?.value;
            }
          }
        },
        error: (error) => {
          console.error('Failed to check status:', error);
          clearInterval(pollInterval);
        }
      });
    }, 10000); // Poll every 10 seconds
  }

  onFileChange(event: any, side: 'front' | 'back' = 'front') {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.signUpForm.patchValue({
          [`idDocument${side.charAt(0).toUpperCase() + side.slice(1)}`]: {
            file: file,
            preview: e.target.result
          }
        });
        this.signUpForm.get(`idDocument${side.charAt(0).toUpperCase() + side.slice(1)}`)?.updateValueAndValidity();
      };
      reader.readAsDataURL(file);
    }
  }

  updateIdDocumentCount() {
    const idType = this.signUpForm.get('idType')?.value;
    this.idDocumentCount = idType === 'Passport' ? 1 : 2;
  }

  updateIdDocumentValidators() {
    const idType = this.signUpForm.get('idType')?.value;
    const backControl = this.signUpForm.get('idDocumentBack');

    if (idType === 'Passport') {
      backControl?.clearValidators();
    } else {
      backControl?.setValidators(Validators.required);
    }

    backControl?.updateValueAndValidity();
  }

  getStepProgress(): number {
    return (this.currentStep / this.totalSteps) * 100;
  }

  toggleIdTypeDropdown(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.isIdTypeDropdownOpen = !this.isIdTypeDropdownOpen;
  }

  closeIdTypeDropdown() {
    this.isIdTypeDropdownOpen = false;
  }

  onOtpVerified(verified: boolean) {
    if (verified) {
      console.log('OTP verified successfully');
      // Redirect to homepage
      this.router.navigate(['/']);
      // Proceed with the sign-up process
      // You can add your sign-up logic here
    } else {
      console.log('OTP verification failed');
      // Handle failed verification
    }
  }

  closeOtpModal() {
    this.showOtpVerification = false;
  }

  hasFileUploaded(side: 'front' | 'back' = 'front'): boolean {
    const control = this.signUpForm.get(`idDocument${side.charAt(0).toUpperCase() + side.slice(1)}`);
    return control?.value && control.value.file instanceof File;
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}

