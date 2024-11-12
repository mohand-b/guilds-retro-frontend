import {Routes} from '@angular/router';
import {authenticatedGuard} from "./routes/authenticated/guards/authenticated.guard";
import {loginGuard} from "./routes/auth/guards/login.guard";

export const routes: Routes = [
  {
    path: 'terms',
    loadComponent: () => import('./routes/terms/components/cgu-page/cgu-page.component').then((m) => m.CguPageComponent),
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./routes/auth/auth.routes').then((m) => m.authRoutes),
    canActivate: [loginGuard],
  },
  {
    path: 'console',
    loadChildren: () => import('./routes/console/console.routes').then(c => c.consoleRoutes)
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
