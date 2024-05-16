import {AuthenticatedComponent} from "./containers/authenticated/authenticated.component";
import {Routes} from "@angular/router";

export const authenticatedRoutes: Routes = [
  {
    path: '',
    component: AuthenticatedComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('../dashboard/dashboard.routes').then(c => c.DashboardRoutes)
      },
      {
        path: 'events',
        loadChildren: () => import('../events/events.routes').then(c => c.EventsRoutes)
      },
      {
        path: 'eternal-harvest',
        loadChildren: () => import('../eternal-harvest/eternal-harvest.routes').then(c => c.EternalHarvestRoutes)
      },
      {
        path: 'feed',
        loadChildren: () => import('../feed/feed.routes').then(c => c.FeedRoutes)
      },
      {
        path: 'guild',
        loadChildren: () => import('../guild/guild.routes').then(c => c.GuildRoutes)
      },
      {
        path: 'profile',
        loadChildren: () => import('../profile/profile.routes').then(c => c.ProfileRoutes)
      },
      {
        path: '**',
        redirectTo: 'dashboard'
      }
    ]
  },

];
