import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatDividerModule],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css',
})
export class UserManagementComponent {
  profile = {
    picture: 'assets/default-avatar.png',
    username: 'Benny Kamsguard',
    role: 'Admin',
    fullName: 'Alex Dev',
    email: 'alex@gmail.com',
    contact: '+254712345890',
    address: 'Kenyatta Road, Kenyatta Road',
    lastLogin: new Date()
  };

  // constructor() { }

  // ngOnInit(): void { }

  editProfile() {
    // Implement profile editing logic here
    console.log('Edit Profile clicked');
  }

  changePassword() {
    // Implement change password logic here
    console.log('Change Password clicked');
  }

  logout() {
    // Implement logout logic here
    console.log('Logout clicked');
  }

}
