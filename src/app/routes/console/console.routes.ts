import {Route} from "@angular/router";

export const consoleRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./containers/dashboard/dashboard.component').then(c => c.DashboardComponent),
    children: [
      {
        path: 'reports',
        loadComponent: () => import('./containers/reports/reports.component').then(c => c.ReportsComponent),
      },
      {
        path: 'feed',
        loadComponent: () => import('./containers/feed/feed.component').then(c => c.FeedComponent),
      },
      {
        path: 'users',
        loadComponent: () => import('./containers/users/users.component').then(c => c.UsersComponent),
      },
      {
        path: 'guilds',
        loadComponent: () => import('./containers/guilds/guilds.component').then(c => c.GuildsComponent),
      },
      {
        path: 'logs',
        loadComponent: () => import('./containers/logs/logs.component').then(c => c.LogsComponent),
      },
      {
        path: '**',
        redirectTo: 'reports',
      }
    ],
  }
]
