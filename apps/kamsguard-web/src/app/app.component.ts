import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './core/layout/header/header.component';
import { FooterComponent } from './core/layout/footer/footer.component';
import { SidebarComponent } from './core/layout/sidenav/sidenav.component';
import { HomeComponent } from './core/home/home.component';
import { AuthComponent } from './core/authentication/authentication.component';
import { SidebarService } from './features/services/sidebar/sidebar.service';
import { CommonModule } from '@angular/common';



@Component({
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, SidebarComponent, HomeComponent, AuthComponent, CommonModule],
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
      // console.log(isVisible)
      this.isSidebarVisible = isVisible;
    });
  }



}
