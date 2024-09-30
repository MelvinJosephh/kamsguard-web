import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './core/layout/header/header.component';
import { FooterComponent } from './core/layout/footer/footer.component';
// import { SidebarComponent } from './core/layout/sidenav/sidenav.component';
import { HomeComponent } from './core/home/home.component';
import { SidebarService } from './features/services/sidebar/sidebar.service';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './core/authentication/login/login.component';
import { RegisterComponent } from './core/authentication/register/register.component';



@Component({
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, HomeComponent, CommonModule, LoginComponent, RegisterComponent, RouterLink],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'kamsguard-web';
  
  isSidebarVisible = true;
  constructor(private sidebarService: SidebarService) {}


  ngOnInit() {
    this.sidebarService.sidebarVisibility$.subscribe((isVisible) => {
      this.isSidebarVisible = isVisible;
    });
  }



}
