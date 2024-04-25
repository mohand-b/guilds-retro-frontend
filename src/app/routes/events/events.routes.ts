import {Route} from "@angular/router";

export const EventsRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./containers/events/events.component').then(c => c.EventsComponent)
  }
];
