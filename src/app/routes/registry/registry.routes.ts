import {Route} from "@angular/router";

export const RegistryRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./containers/users-registry/users-registry.component').then(c => c.UsersRegistryComponent),
  },
];
