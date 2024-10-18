import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { AuthenticationService } from '../services/authentication.service';
import { User } from '@angular/fire/auth'; 


@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatDividerModule, MatButtonModule],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss',
})
export class UserManagementComponent implements OnInit {
  profile: {
    picture: string;
    username: string;
    role: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    lastLogin: Date | null;
  } = {
    picture: 'assets/default-avatar.png',
    username: '',
    role: 'User', // Default role (you can modify as needed)
    fullName: '',
    email: '',
    phoneNumber: '',
    lastLogin: null,
  };

  constructor(private authService: AuthenticationService) {}

  // ngOnInit() {
  //   this.authService.currentUser$.subscribe((user: User | null) => {
  //     if (user) {
  //       // Assuming FirebaseUser provides 'displayName' and 'email'
  //       this.profile.fullName = user.displayName || 'No name provided';
  //       this.profile.email = user.email || 'No email provided';
  //       this.profile.username = user.displayName || 'No username'; 
  //       this.profile.phoneNumber = user.phoneNumber || 'No phone number'; 
  //       this.profile.lastLogin = user.metadata.lastSignInTime
  //         ? new Date(user.metadata.lastSignInTime)
  //         : null;
  //     } else {
  //       console.log('No user is currently logged in.');
  //     }
  //   });
  // }

  ngOnInit() {
    this.authService.currentUser$.subscribe((user: User | null) => {
      if (user) {
        // Update basic profile data
        this.profile.fullName = user.displayName || 'No name provided';
        this.profile.email = user.email || 'No email provided';
        this.profile.username = user.displayName || 'No username';
        this.profile.lastLogin = user.metadata.lastSignInTime
        ? new Date(user.metadata.lastSignInTime)
        : null;
  
        // Fetch additional profile data from Firestore
        this.authService.getUserProfile().subscribe((userProfile) => {
          if (userProfile) {
            this.profile.phoneNumber = userProfile.phoneNumber || 'No phone number provided';
           
          }
        });
      } else {
        console.log('No user is currently logged in.');
      }
    });
  }
  




  editProfile() {
    console.log('Edit Profile clicked');
  }

  changePassword() {
    console.log('Change Password clicked');
  }

  logout() {
    this.authService.logout();
  }
}
