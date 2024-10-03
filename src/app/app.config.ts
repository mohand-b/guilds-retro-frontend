import {ApplicationConfig, importProvidersFrom} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import {TokenInterceptorProvider} from "./shared/services/token-interceptor.service";
import {BrowserModule} from "@angular/platform-browser";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from "@angular/material/form-field";
import {MAT_DATE_LOCALE, MatNativeDateModule} from "@angular/material/core";

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        subscriptSizing: 'dynamic'
      }
    },
    {
      provide: MAT_DATE_LOCALE,
      useValue: 'fr-FR'
    },
    provideHttpClient(withInterceptorsFromDi()),
    TokenInterceptorProvider,
    provideRouter(routes),
    provideAnimationsAsync(),
    importProvidersFrom([
      BrowserModule,
      BrowserAnimationsModule,
      MatSnackBarModule,
      MatNativeDateModule
    ])]
};
