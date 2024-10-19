import { HttpInterceptorFn } from '@angular/common/http';
import { LoadingService } from '../../features/services/loading.service';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);

  // Set custom messages based on the URL or request type
  let loadingMessage = 'Loading...';
  if (req.url.includes('login')) {
    loadingMessage = 'Logging in...';
  } else if (req.url.includes('register')) {
    loadingMessage = 'Registering...';
  }

  // Show the loader with the custom message
  loadingService.loading(loadingMessage);

  return next(req).pipe(
    finalize(() => loadingService.idle())
  );
};
