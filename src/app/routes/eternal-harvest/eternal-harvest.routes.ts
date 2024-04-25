import {Route} from "@angular/router";

export const EternalHarvestRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./containers/eternal-harvest/eternal-harvest.component').then(c => c.EternalHarvestComponent)
  }
];
