import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './core/layout/header/header.component';
import { FooterComponent } from './core/layout/footer/footer.component';
import { CommonModule } from '@angular/common';
import { AuthenticationService } from './features/services/authentication.service';
import { ToastrComponent } from './shared/shared-toastr/toastr.component';
import {NgxSpinnerModule} from 'ngx-spinner';

@Component({
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    CommonModule,
    ToastrComponent,
    NgxSpinnerModule,
  ],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'kamsguard-web';

  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit() {
    // Manage routing based on authentication state
    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.router.navigate(['/dashboard']);
      } else {
        this.router.navigate(['/']);
      }
    });
  }

  // Method to check if the current route is dashboard
  isDashboardRoute(): boolean {
    return this.router.url.startsWith('/dashboard'); // Adjust the route if needed
  }
}
