import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, from } from 'rxjs';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User as FirebaseUser,
} from '@angular/fire/auth';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<FirebaseUser | null> =
    new BehaviorSubject<FirebaseUser | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private auth: Auth) {
    this.auth.onAuthStateChanged((user) => {
      if (user) {
        this.currentUserSubject.next(user);
      } else {
        this.currentUserSubject.next(null);
      }
    });
  }

  // Register new user with Firebase
  register(
    email: string,
    password: string,
    name: any,
    phoneNumber: any,
    subscribe: any
  ): Observable<void> {
    return from(
      createUserWithEmailAndPassword(this.auth, email, password)
    ).pipe(
      map((userCredential) => {
        const user = userCredential.user;
        this.currentUserSubject.next(user);
      }),
      catchError((error) => {
        console.error('Registration error: ', error);
        throw error;
      })
    );
  }

  // Login using Firebase
  login(email: string, password: string): Observable<boolean> {
    return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
      map((userCredential) => {
        const user = userCredential.user;
        this.currentUserSubject.next(user);
        return true; // Login successful
      }),
      catchError((error) => {
        console.error('Login error: ', error);
        return of(false); // Login failed
      })
    );
  }

  // Logout using Firebase
  logout(): Observable<void> {
    return from(signOut(this.auth)).pipe(
      map(() => {
        this.currentUserSubject.next(null);
        window.location.href = '/';
      })
    );
  }
  // Check if user is authenticated
  isAuthenticated(): boolean {
    return this.auth.currentUser !== null;
  }
}
