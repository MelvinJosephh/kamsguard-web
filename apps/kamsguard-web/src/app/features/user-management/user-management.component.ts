import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatDividerModule, MatButtonModule],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss',
})
export class UserManagementComponent {
  profile = {
    picture: 'assets/default-avatar.png',
    username: 'Melvin',
    role: 'Admin',
    fullName: 'Melvin Njuguna',
    email: 'collinsme.2000@gmail.com',
    contact: '+254712345890',
    lastLogin: new Date()
  };

  constructor(
    private authService: AuthenticationService,
  ) {}

  editProfile() {
    // Implement profile editing logic here
    console.log('Edit Profile clicked');
  }

  changePassword() {
    // Implement change password logic here
    console.log('Change Password clicked');
  }

  logout() {
    this.authService.logout(); 
  }

}
