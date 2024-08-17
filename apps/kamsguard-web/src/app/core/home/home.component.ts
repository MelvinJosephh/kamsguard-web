import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from "../layout/footer/footer.component";
import { HeaderComponent } from "../layout/header/header.component";
import { SidebarService } from '../../features/services/sidebar/sidebar.service';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FooterComponent, HeaderComponent, MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  isSidebarVisible = false;

  constructor(private sidebarService: SidebarService, private el: ElementRef) {}

  ngOnInit() {
    this.sidebarService.sidebarVisibility$.subscribe(isVisible => {
      this.isSidebarVisible = isVisible;
    });
  }

  @HostListener('window:scroll', [])
onWindowScroll() {
  const elements = this.el.nativeElement.querySelectorAll('.slide-in-left, .slide-in-right');
  elements.forEach((element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    if (rect.top >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)) {
      element.classList.add('visible');
    } 
  });
}

}
