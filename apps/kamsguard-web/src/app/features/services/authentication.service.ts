import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface User {
  name?: string;
  email: string;
  phoneNumber?: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private users: User[] = [];
  private currentUserSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  register(userData: User): void {
    this.users.push(userData);
    this.currentUserSubject.next(userData); // Set the newly registered user as the current user
  }

  login(email: string, password: string): boolean {
    const user = this.users.find(u => u.email === email && u.password === password);
    if (user) {
      this.currentUserSubject.next(user);
      return true;
    }
    return false;
  }

  logout(): void {
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }
}
