import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-authentication',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SharedModule, MatFormFieldModule, MatButtonModule, MatCardModule, MatCheckboxModule, MatInputModule],
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.scss'],
})
export class AuthComponent {
  authForm: FormGroup;
  isLoginMode = true;

  constructor(private fb: FormBuilder) {
    this.authForm = this.fb.group({
      name: [''],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: [''],
      password: ['', [Validators.required, Validators.minLength(6)]],
      subscribe: [false]
    });

    // Initialize form validators based on initial mode
    this.updateValidators();
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
    this.updateValidators();
  }

  updateValidators() {
    if (this.isLoginMode) {
      // Login mode: disable name and phone number fields
      this.authForm.controls['name'].clearValidators();
      this.authForm.controls['phoneNumber'].clearValidators();
    } else {
      // Sign up mode: enable name and phone number fields
      this.authForm.controls['name'].setValidators([Validators.required]);
      this.authForm.controls['phoneNumber'].setValidators([Validators.required]);
    }

    // Update form control validation
    this.authForm.controls['name'].updateValueAndValidity();
    this.authForm.controls['phoneNumber'].updateValueAndValidity();
  }

  onSubmit() {
    if (!this.authForm.valid) {
      return;
    }
    const authData = this.authForm.value;
    if (this.isLoginMode) {
      // Handle login
    } else {
      // Handle signup
    }
  }
}
