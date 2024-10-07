import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { NgClass } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';
import { Toast, ToastrService } from '../../services/toastr.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-toastr',
  standalone: true,
  imports: [CommonModule, NgClass], 
  templateUrl: './toastr.component.html',
  styleUrls: ['./toastr.component.scss'], 
  animations: [
    trigger('toastAnimation', [
      transition(':enter', [
        style({ transform: 'translateY(100%)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateY(0)', opacity: 1 })),
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ transform: 'translateY(100%)', opacity: 0 })),
      ]),
    ]),
  ],
})
export class ToastrComponent implements OnInit, OnDestroy {
  private toastrService = inject(ToastrService);

  toasts: Toast[] = [];
  private subscription: Subscription | undefined;

  ngOnInit(): void {
    this.subscription = this.toastrService.toasts$.subscribe((toasts) => (this.toasts = toasts));
  }

  removeToast(id: number) {
    this.toastrService.remove(id);
  }

  trackById(index: number, toast: Toast): number {
    return toast.id;
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
