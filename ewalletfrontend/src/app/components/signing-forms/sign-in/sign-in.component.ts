import { Component, ViewEncapsulation, ChangeDetectionStrategy, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  imports: [CommonModule, ReactiveFormsModule],
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignInComponent {
  signInForm: FormGroup;
  isDarkMode = false;

  constructor(private fb: FormBuilder, @Inject(DOCUMENT) private document: Document) {
    this.signInForm = this.fb.group({
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    // Check for dark mode preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    this.setDarkMode(prefersDark.matches);

    // Listen for changes in color scheme preference
    prefersDark.addListener((mediaQuery) => this.setDarkMode(mediaQuery.matches));
  }

  setDarkMode(isDark: boolean) {
    this.isDarkMode = isDark;
    if (isDark) {
      this.document.body.classList.add('dark');
    } else {
      this.document.body.classList.remove('dark');
    }
  }

  onSubmit() {
    if (this.signInForm.valid) {
      console.log(this.signInForm.value);
      // Handle form submission logic here
    }
  }
}

