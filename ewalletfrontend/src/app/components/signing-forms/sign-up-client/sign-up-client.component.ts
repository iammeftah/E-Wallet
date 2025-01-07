import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import {OtpVerificationComponent} from '../../elements/otp-verification/otp-verification.component';
import {LoaderComponent} from '../../elements/loader/loader.component';
import { AgencyService } from '../../../services/agency.service';
import {Router} from '@angular/router';
import {ClientSignUpData} from '../../../models/auth.model';


@Component({
  selector: 'app-sign-up-client',
  templateUrl: './sign-up-client.component.html',
  imports: [CommonModule, ReactiveFormsModule, OtpVerificationComponent, LoaderComponent],
  standalone: true
})
export class SignUpClientComponent implements OnInit {
  signUpForm: FormGroup;
  currentStep = 1;
  totalSteps = 1;
  steps: string[] = ['Personal Info'];

  isIdTypeDropdownOpen = false;
  idDocumentCount: number = 1;

  idTypes: string[] = ['CIN', 'Passport', 'Residence Permit'];
  clientTypes: string[] = ['HSSAB1', 'HSSAB2', 'HSSAB3'];

  showOtpVerification = false;
  phoneNumber = '';

  isLoading: boolean = false;


  constructor(
    private fb: FormBuilder,
    private agencyService: AgencyService,
    private router: Router
  ) {
    this.signUpForm = this.fb.group({
      clientType: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      email: ['', [Validators.required, Validators.email]],
      idType: [''],
      idNumber: [''],
      idDocument: [null],
      idDocumentBack: [null],
      incomeProof: [null]
    });

    this.signUpForm.get('clientType')?.valueChanges.subscribe(value => {
      this.updateFormValidators(value);
    });
  }

  ngOnInit() {}

  updateFormValidators(clientType: string): void {
    const emailControl = this.signUpForm.get('email');
    const idTypeControl = this.signUpForm.get('idType');
    const idDocumentControl = this.signUpForm.get('idDocument');
    const idDocumentBackControl = this.signUpForm.get('idDocumentBack');
    const incomeProofControl = this.signUpForm.get('incomeProof');

    // Reset validators and steps
    emailControl?.clearValidators();
    idTypeControl?.clearValidators();
    idDocumentControl?.clearValidators();
    idDocumentBackControl?.clearValidators();
    incomeProofControl?.clearValidators();
    this.steps = ['Personal Info'];
    this.totalSteps = 1;

    if (clientType === 'HSSAB1') {
      // No additional validators or steps
    } else if (clientType === 'HSSAB2') {
      emailControl?.setValidators([Validators.required, Validators.email]);
      idTypeControl?.setValidators([Validators.required]);
      idDocumentControl?.setValidators([Validators.required]);

      // Add a listener for idType changes
      idTypeControl?.valueChanges.subscribe((idType: string) => {
        this.idDocumentCount = (idType === 'Passport') ? 1 : 2;
        if (this.idDocumentCount === 2) {
          idDocumentBackControl?.setValidators([Validators.required]);
        } else {
          idDocumentBackControl?.clearValidators();
        }
        idDocumentBackControl?.updateValueAndValidity();
      });
      this.steps.push('Identity');
      this.totalSteps = 2;
    } else if (clientType === 'HSSAB3') {
      emailControl?.setValidators([Validators.required, Validators.email]);
      idTypeControl?.setValidators([Validators.required]);
      idDocumentControl?.setValidators([Validators.required]);
      incomeProofControl?.setValidators([Validators.required]);

      // Add a listener for idType changes
      idTypeControl?.valueChanges.subscribe((idType: string) => {
        this.idDocumentCount = (idType === 'Passport') ? 1 : 2;
        if (this.idDocumentCount === 2) {
          idDocumentBackControl?.setValidators([Validators.required]);
        } else {
          idDocumentBackControl?.clearValidators();
        }
        idDocumentBackControl?.updateValueAndValidity();
      });
      this.steps.push('Identity', 'Income Proof');
      this.totalSteps = 3;
    } else {
      idTypeControl?.clearValidators();
      idDocumentControl?.clearValidators();
      idDocumentBackControl?.clearValidators();
    }

    emailControl?.updateValueAndValidity();
    idTypeControl?.updateValueAndValidity();
    idDocumentControl?.updateValueAndValidity();
    idDocumentBackControl?.updateValueAndValidity();
    incomeProofControl?.updateValueAndValidity();

    // Reset to first step when changing client type
    this.currentStep = 1;
  }

  nextStep() {
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  // In sign-up-client.component.ts
  // In sign-up-client.component.ts
  onSubmit() {
    if (this.signUpForm.valid) {
      console.log('Form submitted with values:', this.signUpForm.value);
      this.isLoading = true;

      // Create the ClientSignUpData object
      const clientData: ClientSignUpData = {
        clientType: this.signUpForm.get('clientType')?.value,
        firstName: this.signUpForm.get('firstName')?.value,
        lastName: this.signUpForm.get('lastName')?.value,
        phone: this.signUpForm.get('phone')?.value,
        email: this.signUpForm.get('email')?.value,
        idType: this.signUpForm.get('idType')?.value,
        idNumber: this.signUpForm.get('idNumber')?.value,
      };

      console.log('Prepared client data:', clientData);

      // Create FormData and append all the data
      const formData = new FormData();

      // Append all non-file fields
      Object.keys(clientData).forEach(key => {
        if (clientData[key as keyof ClientSignUpData]) {
          formData.append(key, clientData[key as keyof ClientSignUpData] as string);
          console.log(`Appending ${key}:`, clientData[key as keyof ClientSignUpData]);
        }
      });

      // Log files being uploaded
      const idDocument = this.signUpForm.get('idDocument')?.value;
      if (idDocument) {
        console.log('Uploading ID document:', idDocument.name, 'Size:', idDocument.size);
        formData.append('idDocument', idDocument);
      }

      const idDocumentBack = this.signUpForm.get('idDocumentBack')?.value;
      if (idDocumentBack) {
        console.log('Uploading ID document back:', idDocumentBack.name, 'Size:', idDocumentBack.size);
        formData.append('idDocumentBack', idDocumentBack);
      }

      const incomeProof = this.signUpForm.get('incomeProof')?.value;
      if (incomeProof) {
        console.log('Uploading income proof:', incomeProof.name, 'Size:', incomeProof.size);
        formData.append('incomeProof', incomeProof);
      }

      this.agencyService.submitRegistrationRequest(formData).subscribe({
        next: (response) => {
          console.log('Registration request successful. Response:', response);
          this.isLoading = false;
          this.phoneNumber = this.signUpForm.get('phone')?.value;
          this.showOtpVerification = true;
        },
        error: (error) => {
          console.error('Registration request failed:', error);
          if (error.error) {
            console.error('Error details:', error.error);
          }
          this.isLoading = false;
        }
      });
    } else {
      console.warn('Form validation failed. Form errors:', this.signUpForm.errors);
      console.warn('Individual field errors:', {
        clientType: this.signUpForm.get('clientType')?.errors,
        firstName: this.signUpForm.get('firstName')?.errors,
        lastName: this.signUpForm.get('lastName')?.errors,
        phone: this.signUpForm.get('phone')?.errors,
        email: this.signUpForm.get('email')?.errors,
        idType: this.signUpForm.get('idType')?.errors,
        idNumber: this.signUpForm.get('idNumber')?.errors,
      });
    }
  }

  onOtpVerified(verified: boolean) {
    if (verified) {
      console.log('OTP verified successfully');
      this.closeOtpModal();
      // Proceed with the sign-up process
      // You can add your sign-up logic here
    } else {
      console.log('OTP verification failed');
      // Handle failed verification
    }
  }

  onFileChange(event: any, fileType: 'idDocument' | 'idDocumentBack' | 'incomeProof') {
    const file = event.target.files[0];
    this.signUpForm.patchValue({
      [fileType]: file
    });
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

  closeOtpModal() {
    this.showOtpVerification = false;
  }
}

