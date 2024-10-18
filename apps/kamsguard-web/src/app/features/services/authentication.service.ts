import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, from } from 'rxjs';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User as FirebaseUser,
  updateProfile,
} from '@angular/fire/auth';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore'; // For Firestore actions
import { map, catchError, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<FirebaseUser | null> =
    new BehaviorSubject<FirebaseUser | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private auth: Auth, private firestore: Firestore) {
    // Listen to authentication state changes
    this.auth.onAuthStateChanged((user) => {
      if (user) {
        this.currentUserSubject.next(user);
      } else {
        this.currentUserSubject.next(null);
      }
    });
  }

  // Register new user with Firebase
  // register(
  //   email: string,
  //   password: string,
  //   name: any,
  //   phoneNumber: any,
  //   subscribe: any
  // ): Observable<void> {
  //   return from(
  //     createUserWithEmailAndPassword(this.auth, email, password)
  //   ).pipe(
  //     map((userCredential) => {
  //       const user = userCredential.user;
  //       this.currentUserSubject.next(user);
  //     }),
  //     catchError((error) => {
  //       console.error('Registration error: ', error);
  //       throw error;
  //     })
  //   );
  // }



  // Register a new user with Firebase and update their profile
  register(
    email: string,
    password: string,
    name: string,
    phoneNumber: string,
    subscribe = false // TypeScript infers the boolean type, no need to annotate
  ): Observable<void> {
    return from(createUserWithEmailAndPassword(this.auth, email, password)).pipe(
      switchMap((userCredential) => {
        const user = userCredential.user;

        // Update Firebase Authentication user profile with name
        return from(
          updateProfile(user, {
            displayName: name, // Update displayName in Firebase
          })
        ).pipe(
          // Store additional user information like phoneNumber and subscribe in Firestore
          switchMap(() => {
            const userRef = doc(this.firestore, `users/${user.uid}`);
            return from(
              setDoc(userRef, {
                phoneNumber: phoneNumber, // Store phone number in Firestore
                subscribe: subscribe, // Store subscription status
              })
            );
          }),
          map(() => {
            this.currentUserSubject.next(user); // Update the current user state
          })
        );
      }),
      catchError((error) => {
        console.error('Registration error: ', error);
        throw error;
      })
    );
  }

  // Get user profile data from Firestore (optional for phone number & subscribe)
  getUserProfile(): Observable<any> {
    const user = this.auth.currentUser;

    if (user) {
      const userRef = doc(this.firestore, `users/${user.uid}`);
      return from(getDoc(userRef)).pipe(
        map((docSnapshot) => {
          if (docSnapshot.exists()) {
            const data = docSnapshot.data();
            return {
              displayName: user.displayName, // Get from Firebase Authentication profile
              email: user.email,
              phoneNumber: data['phoneNumber'], // Access with square brackets due to index signature
              subscribe: data['subscribe'], // Access with square brackets due to index signature
            };
          } else {
            return null;
          }
        }),
        catchError((error) => {
          console.error('Error fetching user profile: ', error);
          throw error;
        })
      );
    } else {
      return of(null); // Return null if the user is not authenticated
    }
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
