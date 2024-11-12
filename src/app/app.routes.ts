import {Routes} from '@angular/router';
import {authenticatedGuard} from "./routes/authenticated/guards/authenticated.guard";
import {loginGuard} from "./routes/auth/guards/login.guard";
import {AppRankEnum} from "./routes/authenticated/state/authed/authed.model";
import {rankGuard} from "./routes/authenticated/guards/rank.guard";

export const routes: Routes = [
  {
    path: 'terms',
    loadComponent: () => import('./routes/terms/components/cgu-page/cgu-page.component').then((m) => m.CguPageComponent),
  },
  {
    path: 'auth',
    canActivate: [loginGuard],
    loadChildren: () => import('./routes/auth/auth.routes').then((m) => m.authRoutes),
  },
  {
    path: 'console',
    canActivate: [rankGuard],
    data: {appRank: AppRankEnum.MODERATOR},
    loadChildren: () => import('./routes/console/console.routes').then(c => c.consoleRoutes),
  },
  {
    path: '',
    canActivate: [authenticatedGuard],
    loadChildren: () => import('./routes/authenticated/authenticated.routes').then((c) => c.authenticatedRoutes),
  },
  {
    path: '**',
    redirectTo: '',
  },

];
