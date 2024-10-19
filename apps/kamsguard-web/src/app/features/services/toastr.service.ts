import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToastrService {

  private toasts: Toast[] = [];
  private toastSubject = new BehaviorSubject<Toast[]>([]);
  toasts$ = this.toastSubject.asObservable();

  private show(title: string, message: string, type:'success' | 'warning' | 'error' | 'info'){
const id = Date.now();
const toast: Toast = {id, title, message, type};
this.toasts.push(toast)
this.toastSubject.next(this.toasts);
setTimeout(()=> this.remove(id), 3000);
return id
  }
  remove(id: number) {
    this.toasts = this.toasts.filter(t=> t.id !== id)
    this.toastSubject.next(this.toasts)
  }

  success(title: string, message: string): number{
    return this.show(title, message, 'success');
  }

  error(title: string, message: string): number{
    return this.show(title, message, 'error');
  }

  info(title: string, message: string): number{
    return this.show(title, message, 'info');
  }

  warning(title: string, message: string): number{
    return this.show(title, message, 'warning');
  }
}

 
export interface Toast {
  id: number;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'error' | 'info'
}
