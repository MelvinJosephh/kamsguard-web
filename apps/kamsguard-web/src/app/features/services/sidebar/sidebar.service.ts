// sidebar.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  private sidebarVisibilitySubject = new BehaviorSubject<boolean>(true); // Default to visible
  sidebarVisibility$ = this.sidebarVisibilitySubject.asObservable();

  toggleSidebar() {
    this.sidebarVisibilitySubject.next(!this.sidebarVisibilitySubject.value);
  }

  setSidebarVisibility(isVisible: boolean) {
    this.sidebarVisibilitySubject.next(isVisible);
  }
}
