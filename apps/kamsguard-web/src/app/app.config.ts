import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { CommonModule } from '@angular/common';
import { ToastrModule } from 'ngx-toastr';
import { provideHttpClient } from '@angular/common/http';
import { firestoreProvider } from './shared/firestore.provider';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideAnimationsAsync(),
    ...firestoreProvider(),
    provideHttpClient(),
    importProvidersFrom(
      CommonModule,
      ToastrModule.forRoot({
        positionClass: 'toast-bottom-right', // Adjust position as needed
        preventDuplicates: true,
      })
    ),
  ],
};
