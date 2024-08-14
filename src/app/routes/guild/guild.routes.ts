import {Route} from "@angular/router";

export const GuildRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./containers/guild-dashboard/guild-dashboard.component').then(c => c.GuildDashboardComponent)
  },
  {
    path: ':guildId',
    loadComponent: () => import('./containers/guild-details/guild-details.component').then(c => c.GuildDetailsComponent)
  }
]
