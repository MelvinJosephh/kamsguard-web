import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './core/layout/header/header.component';
import { FooterComponent } from './core/layout/footer/footer.component';
import { SharedModule } from './shared/shared.module';
import { SidebarComponent } from './core/layout/sidenav/sidenav.component';
import { HomeComponent } from './core/home/home.component';
import { AuthComponent } from './core/authentication/authentication.component';
import { SidebarService } from './features/services/sidebar/sidebar.service';



@Component({
  standalone: true,
  imports: [RouterModule, HeaderComponent, FooterComponent, SharedModule, SidebarComponent, HomeComponent, AuthComponent],
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
