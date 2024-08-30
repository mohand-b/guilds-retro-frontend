import {Route} from "@angular/router";

export const RegistryRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./containers/users-registry/users-registry.component').then(c => c.UsersRegistryComponent),
  },
  {
    path: 'user/:username',
    loadComponent: () => import('../profile/containers/profile/profile.component').then(c => c.ProfileComponent),
  }
];
