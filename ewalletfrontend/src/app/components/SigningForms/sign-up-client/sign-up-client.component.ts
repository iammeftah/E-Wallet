import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-sign-up-client',
  templateUrl: './sign-up-client.component.html',
  imports: [CommonModule, ReactiveFormsModule],
  standalone: true
})
export class SignUpClientComponent {
  signUpForm: FormGroup;

  // Add ID types for the dropdown
  idTypes: string[] = ['CIN', 'Passport', 'Carte sejour'];

  // Add client types for the dropdown
  clientTypes: string[] = ['HSSAB1', 'HSSAB2', 'HSSAB3'];

  constructor(private fb: FormBuilder) {
    this.signUpForm = this.fb.group({
      clientType: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      email: ['', [Validators.email]],
      idType: [''],
      idNumber: [''],
      idDocument: [null],
      incomeProof: [null]
    });

    this.signUpForm.get('clientType')?.valueChanges.subscribe(value => {
      this.updateFormValidators(value);
    });
  }

  updateFormValidators(clientType: string): void {
    const idTypeControl = this.signUpForm.get('idType');
    const idNumberControl = this.signUpForm.get('idNumber');
    const idDocumentControl = this.signUpForm.get('idDocument');

    if (clientType === 'individual') {
      idTypeControl?.setValidators([Validators.required]);
      idNumberControl?.setValidators([Validators.required]);
      idDocumentControl?.setValidators([Validators.required]);
    } else {
      idTypeControl?.clearValidators();
      idNumberControl?.clearValidators();
      idDocumentControl?.clearValidators();
    }
    idTypeControl?.updateValueAndValidity();
    idNumberControl?.updateValueAndValidity();
    idDocumentControl?.updateValueAndValidity();
  }

  onSubmit() {
    if (this.signUpForm.valid) {
      console.log(this.signUpForm.value);
      // Submit the form data
    }
  }

  onFileChange(event: any, fileType: 'idDocument' | 'incomeProof') {
    const file = event.target.files[0];
    this.signUpForm.patchValue({
      [fileType]: file
    });
  }
}
