import { Component, Input, Output, EventEmitter, OnInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-otp-verification',
  templateUrl: './otp-verification.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class OtpVerificationComponent implements OnInit {
  @Input() phoneNumber: string = '';
  @Output() otpVerified = new EventEmitter<boolean>();
  @Output() closeModal = new EventEmitter<void>();

  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef<HTMLInputElement>>;

  otpForm: FormGroup;
  remainingTime: number = 60;
  timerInterval: any;

  constructor(private fb: FormBuilder) {
    this.otpForm = this.fb.group({
      digit1: ['', [Validators.required, Validators.pattern(/^\d$/)]],
      digit2: ['', [Validators.required, Validators.pattern(/^\d$/)]],
      digit3: ['', [Validators.required, Validators.pattern(/^\d$/)]],
      digit4: ['', [Validators.required, Validators.pattern(/^\d$/)]],
      digit5: ['', [Validators.required, Validators.pattern(/^\d$/)]],
      digit6: ['', [Validators.required, Validators.pattern(/^\d$/)]]
    });
  }

  ngOnInit() {
    this.startTimer();
  }

  ngOnDestroy() {
    this.stopTimer();
  }

  startTimer() {
    this.remainingTime = 60;
    this.timerInterval = setInterval(() => {
      if (this.remainingTime > 0) {
        this.remainingTime--;
      } else {
        this.stopTimer();
      }
    }, 1000);
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  onSubmit() {
    if (this.otpForm.valid) {
      const otp = Object.values(this.otpForm.value).join('');
      console.log('Verifying OTP:', otp);
      // For demonstration purposes, we'll just emit true
      this.otpVerified.emit(true);
    }
  }

  resendOtp() {
    console.log('Resending OTP to:', this.phoneNumber);
    this.startTimer();
  }

  onDigitInput(event: any, index: number) {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    if (value.length === 1) {
      if (index < 5) {
        const nextInput = this.otpInputs.get(index + 1);
        if (nextInput) {
          nextInput.nativeElement.focus();
        }
      }
    } else if (value.length === 0 && index > 0) {
      const prevInput = this.otpInputs.get(index - 1);
      if (prevInput) {
        prevInput.nativeElement.focus();
      }
    }
  }

  onClose() {
    this.closeModal.emit();
  }
}
