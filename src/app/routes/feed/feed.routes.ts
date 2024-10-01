import {Route} from "@angular/router";

export const FeedRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./containers/feed/feed.component').then(c => c.FeedComponent)
  },
  {
    path: 'post/:id',
    loadComponent: () => import('./containers/post/post.component').then(c => c.PostComponent)
  }
]
