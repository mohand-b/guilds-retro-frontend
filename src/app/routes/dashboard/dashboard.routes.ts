import {Route} from "@angular/router";

export const DashboardRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./containers/dashboard/dashboard.component').then(c => c.DashboardComponent)
  }
]
