import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import {OtpVerificationComponent} from '../../elements/otp-verification/otp-verification.component';


@Component({
  selector: 'app-sign-up-client',
  templateUrl: './sign-up-client.component.html',
  imports: [CommonModule, ReactiveFormsModule, OtpVerificationComponent],
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

  constructor(private fb: FormBuilder) {
    this.signUpForm = this.fb.group({
      clientType: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      email: [''],
      idType: [''],
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

  onSubmit() {
    if (this.signUpForm.valid) {
      console.log(this.signUpForm.value);
      this.phoneNumber = this.signUpForm.get('phone')?.value;
      this.showOtpVerification = true;
    }
  }

  onOtpVerified(verified: boolean) {
    if (verified) {
      console.log('OTP verified successfully');
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
}

