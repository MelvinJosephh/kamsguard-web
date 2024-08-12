import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from "./layout/header/header.component";
import { FooterComponent } from "./layout/footer/footer.component";
import { SharedModule } from './shared/shared.module';
import { SidebarComponent } from "./layout/sidenav/sidenav.component";
import { SidebarService } from './services/sidebar/sidebar.service';
import { HomeComponent } from "./home/home.component";
import { AuthComponent } from "./authentication/authentication.component";


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
