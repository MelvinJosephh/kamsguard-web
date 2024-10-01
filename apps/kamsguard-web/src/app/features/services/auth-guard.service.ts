import { CanActivateFn, UrlTree, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthenticationService } from './authentication.service';  // Update the import path
import { ToastrService } from 'ngx-toastr';

export const authGuard: CanActivateFn = (
): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree => {

  // Inject the AuthenticationService
  const authService = inject(AuthenticationService);
  const router = inject(Router);
  const toastr = inject(ToastrService);

  return new Observable<boolean | UrlTree>((observer) => {
    authService.currentUser$.subscribe((user) => {
      if (user) {
        observer.next(true);  // User is authenticated
      } else {
        toastr.warning('Please login to proceed.');
        observer.next(router.createUrlTree(['/login']));  // Redirect to login
      }
    });
  });
};
