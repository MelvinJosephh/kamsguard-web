import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { SidebarService } from '../services/sidebar/sidebar.service';
import { FooterComponent } from "../layout/footer/footer.component";
import { HeaderComponent } from "../layout/header/header.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, SharedModule, FooterComponent, HeaderComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  isSidebarVisible = false;

  constructor(private sidebarService: SidebarService) {}

  ngOnInit() {
    this.sidebarService.sidebarVisibility$.subscribe(isVisible => {
      this.isSidebarVisible = isVisible;
    });
  }
}
