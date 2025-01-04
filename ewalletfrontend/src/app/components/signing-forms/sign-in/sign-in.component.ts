import { Component, ViewEncapsulation, ChangeDetectionStrategy, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { DOCUMENT } from '@angular/common';
import { LoaderComponent } from '../../elements/loader/loader.component';
import {AuthService} from '../../../services/auth.service';
import {Router} from '@angular/router';
import {ToastComponent} from '../../elements/toast/toast.component';
import {ToastService} from '../../../services/toast.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LoaderComponent,
  ],
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignInComponent {
  signInForm: FormGroup;
  isDarkMode = false;
  isLoading = false;

  constructor(
      private fb: FormBuilder,
      private authService: AuthService,
      private router: Router,
      private toastService: ToastService,  // Add this
      @Inject(DOCUMENT) private document: Document
    ) {
    this.signInForm = this.fb.group({
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
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

  async onSubmit(): Promise<void> {
    console.log("Login submit");
    if (this.signInForm.valid) {
      this.isLoading = true;
      console.log(this.signInForm.value);

      try {
        const credentials = this.signInForm.value;
        const user = await this.authService.signIn(credentials).toPromise();

        if (user) {
          switch (user.role) {
            case 'AGENT':
              await this.router.navigate(['/']);
              break;
            case 'CLIENT':
              await this.router.navigate(['/']);
              break;
            case 'ADMIN':
              await this.router.navigate(['/backoffice']);
              break;
            default:
              await this.router.navigate(['/']);
          }
        }
      } catch (error: any) {
        console.error('Sign in error:', error);
        // Display error message to the user
        if (error.status === 403) {
          // Handle forbidden error (e.g., invalid credentials)
          // You can update the UI to show an error message
          console.error('Invalid credentials');
        } else {
          // Handle other types of errors
          console.error('An unexpected error occurred');
        }
      } finally {
        this.isLoading = false;
      }
    }
  }
}
