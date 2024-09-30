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
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      subscribe: [false],
    });
  }


  onSubmit() {
    if (!this.registerForm.valid) {
      return;
    }

    // Extract form values
    const { email, password } = this.registerForm.value;

    // Call the authentication service to register the user
    this.authService.register(email, password).subscribe({
      next: () => {
        // Handle successful registration
        alert('Registration successful! Please log in.');
        this.router.navigate(['/login']); // Redirect to login page
      },
      error: (err) => {
        // Handle registration error
        console.error('Registration error:', err);
        alert('An error occurred during registration. Please try again later.');
      }
    });
  }

  
  // onSubmit() {
  //   if (!this.registerForm.valid) {
  //     return;
  //   }
  //   const authData = this.registerForm.value;
  //   this.authService.register(authData).subscribe({
  //     next: (response) => {
  //       // Handle successful registration
  //       alert('Registration successful! Please log in.');
  //       this.router.navigate(['/login']); // Redirect to login after registration
  //     },
  //     error: (err) => {
  //       // Handle registration error
  //       console.error('Registration error:', err);
  //       alert('An error occurred during registration. Please try again later.');
  //     }
  //   });
  // }
}
