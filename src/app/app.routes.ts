import {Routes} from '@angular/router';
import {authenticatedGuard} from "./routes/authenticated/guards/authenticated.guard";
import {loginGuard} from "./routes/auth/guards/login.guard";

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('./routes/auth/auth.routes').then((m) => m.authRoutes),
    canActivate: [loginGuard],
  },
  {
    path: '',
    loadChildren: () =>
      import('./routes/authenticated/authenticated.routes').then(
        (c) => c.authenticatedRoutes,
      ),
    canActivate: [authenticatedGuard],
  },
  {
    path: '**',
    redirectTo: '',
  },

];
