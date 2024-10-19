import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  loadingRequestCount = 0;

  constructor(private spinnerService: NgxSpinnerService) { }

  loading(message = '') {
    this.loadingRequestCount++;
    
    this.spinnerService.show(undefined, {
      type: 'ball-scale-ripple-multiple',
      bdColor: 'rgba(0,0,0,0.8)',
      color: '#fff',
      size: 'default',
      fullScreen: true
    });

    if (message) {
      // You can show a custom message if needed
      const spinnerElement = document.querySelector('.ngx-spinner p');
      if (spinnerElement) {
        spinnerElement.innerHTML = message;
      }
    }
  }

  idle() {
    this.loadingRequestCount--;
    if (this.loadingRequestCount <= 0) {
      this.loadingRequestCount = 0;
      this.spinnerService.hide();
    }
  }

  hideLoading() {
    this.spinnerService.hide();
  }
}
