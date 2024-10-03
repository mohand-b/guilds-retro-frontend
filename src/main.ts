import {bootstrapApplication} from '@angular/platform-browser';
import {appConfig} from './app/app.config';
import {AppComponent} from './app/app.component';
import {PrimeNGConfig} from "primeng/api";
import {inject} from "@angular/core";

bootstrapApplication(AppComponent, appConfig)
  .then(() => {
    const primengConfig = inject(PrimeNGConfig);
    primengConfig.ripple = true;
  })
  .catch((err) => console.error(err));
