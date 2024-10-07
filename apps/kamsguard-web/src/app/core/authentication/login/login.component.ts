import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterModule, Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';

import { MatCheckboxModule } from '@angular/material/checkbox'; // Included if needed
import { AuthenticationService } from '../../../features/services/authentication.service';
import { ToastrService } from '../../../services/toastr.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatCheckboxModule, // Included if using checkboxes
    RouterModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['../auth-shared.styles.scss'], // Reusing shared styles
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private router: Router,
    private toastrService: ToastrService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (!this.loginForm.valid) {
      return;
    }
    const { email, password } = this.loginForm.value;
    this.authService.login(email, password).subscribe({
      next: async (success) => {
        if (success) {
          await this.router.navigate(['/dashboard']);
          this.toastrService.success('Success', 'Login successful!');
        } else {
          this.toastrService.error(
            'Error',
            'Login failed. Please check your credentials.'
          );
        }
      },
      error: (err) => {
        // Handle error (e.g., network issues)
        console.error('Login error:', err);
        this.toastrService.error(
          'Error',
          'An error occurred during login. Please try again later.'
        );
      },
    });
  }
}
