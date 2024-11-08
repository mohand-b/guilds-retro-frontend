import {ApplicationConfig, importProvidersFrom, LOCALE_ID} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {provideHttpClient, withInterceptorsFromDi} from "@angular/common/http";
import {TokenInterceptorProvider} from "./shared/services/token-interceptor.service";
import {BrowserModule} from "@angular/platform-browser";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {DialogService, DynamicDialogModule} from "primeng/dynamicdialog";

export const appConfig: ApplicationConfig = {
  providers: [
    {provide: LOCALE_ID, useValue: 'fr-FR'},
    provideHttpClient(withInterceptorsFromDi()),
    TokenInterceptorProvider,
    provideRouter(routes),
    provideAnimationsAsync(),
    importProvidersFrom(DynamicDialogModule),
    DialogService,
    importProvidersFrom([
      BrowserModule,
      BrowserAnimationsModule,

    ])]
};
