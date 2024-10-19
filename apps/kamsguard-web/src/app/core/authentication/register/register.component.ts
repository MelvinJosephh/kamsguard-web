// register.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterModule, Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AuthenticationService } from '../../../features/services/authentication.service';
import { ToastrService } from '../../../features/services/toastr.service';
import { LoadingService } from '../../../features/services/loading.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatCheckboxModule,
    RouterModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['../auth-shared.styles.scss'], // Reusing shared styles
})
export class RegisterComponent {
  
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private router: Router,
    private toastrService: ToastrService,
    private loadingService: LoadingService
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [
        Validators.required,
        Validators.pattern(/^\+?\d{10,15}$/) 
      ]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      subscribe: [false],
    });
  }

  onSubmit() {
    
    if (!this.registerForm.valid) {
      this.toastrService.error('Error', 'Please correct the errors in the form before submitting.');
      return;
    }

    this.  loadingService.loading();
    const { email, password, name, phoneNumber, subscribe } = this.registerForm.value;
    this.authService.register(email, password, name, phoneNumber, subscribe).subscribe({
      next: () => {
        // Handle successful registration
        this.toastrService.success('Success', 'Registration successful! Please log in.');
        this.router.navigate(['/login']); 
        this.loadingService.idle();  
      },
      error: (err) => {
        this.  loadingService.idle();
        // Handle registration error
        console.error('Registration error:', err);
        this.toastrService.error('Error', 'An error occurred during registration. Please confirm your details.');
      }
    });
  }
}
