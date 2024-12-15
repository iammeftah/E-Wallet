import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-sign-up-agent',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
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

  constructor(private fb: FormBuilder) {
    this.signUpForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      idType: ['', Validators.required],
      idNumber: ['', Validators.required],
      birthdate: ['', Validators.required],
      address: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      confirmEmail: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      immatriculation: ['', Validators.required],
      patentNumber: ['', Validators.required],
      idDocumentFront: [null],
      idDocumentBack: [null]
    }, { validator: this.emailMatchValidator });

    this.signUpForm.get('idType')?.valueChanges.subscribe(() => {
      this.updateIdDocumentCount();
    });
  }

  ngOnInit() {}

  emailMatchValidator(group: FormGroup) {
    const email = group.get('email')?.value;
    const confirmEmail = group.get('confirmEmail')?.value;
    return email === confirmEmail ? null : { emailMismatch: true };
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





    }
  }

  onFileChange(event: any, side: 'front' | 'back' = 'front') {
    const file = event.target.files[0];
    this.signUpForm.patchValue({
      [`idDocument${side.charAt(0).toUpperCase() + side.slice(1)}`]: file
    });
  }

  updateIdDocumentCount() {
    const idType = this.signUpForm.get('idType')?.value;
    this.idDocumentCount = idType === 'Passport' ? 1 : 2;
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
