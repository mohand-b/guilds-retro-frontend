import {AuthenticatedComponent} from "./containers/authenticated/authenticated.component";
import {Routes} from "@angular/router";

export const authenticatedRoutes: Routes = [
  {
    path: '',
    component: AuthenticatedComponent,
  },
];
