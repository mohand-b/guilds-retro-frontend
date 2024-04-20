import {RegisterComponent} from "./containers/register/register.component";
import {Routes} from "@angular/router";
import {LoginComponent} from "./containers/login/login.component";

export const authRoutes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
];
