import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { routes } from './app.routes';
import { environment } from '../environments/environment';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideMessaging, getMessaging, getToken } from '@angular/fire/messaging';
import { getFunctions, provideFunctions } from '@angular/fire/functions';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),

    // Firebase
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFunctions(() => {
      const functions = getFunctions();
      functions.region = "europe-west1"
      return functions;
    }),
    provideFirestore(() => getFirestore()),
    provideMessaging(() => {
      const messaging = getMessaging()
      getToken(messaging, {vapidKey:environment.firebaseConfig.vapidKey})
      return messaging
    }),
  ]
};

