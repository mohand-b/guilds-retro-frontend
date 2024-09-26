import {Route} from "@angular/router";

export const FeedRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./containers/feed/feed.component').then(c => c.FeedComponent)
  },

]
