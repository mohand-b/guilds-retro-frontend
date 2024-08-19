import {Route} from "@angular/router";

export const ProfileRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./containers/profile/profile.component').then(c => c.ProfileComponent)
  },
  {
    path: ':username',
    loadComponent: () => import('./containers/profile/profile.component').then(c => c.ProfileComponent)
  }
]
