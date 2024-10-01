import {AuthenticatedComponent} from "./containers/authenticated/authenticated.component";
import {Routes} from "@angular/router";
import {roleGuard} from "./guards/role.guard";
import {UserRoleEnum} from "./state/authed/authed.model";

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
        canActivate: [roleGuard],
        data: {role: UserRoleEnum.MEMBER},
        loadChildren: () => import('../events/events.routes').then(c => c.EventsRoutes)
      },
      {
        path: 'eternal-harvest',
        canActivate: [roleGuard],
        data: {role: UserRoleEnum.MEMBER},
        loadChildren: () => import('../eternal-harvest/eternal-harvest.routes').then(c => c.EternalHarvestRoutes)
      },
      {
        path: 'guild',
        canActivate: [roleGuard],
        data: {role: UserRoleEnum.MEMBER},
        loadChildren: () => import('../guild/guild.routes').then(c => c.GuildRoutes)
      },
      {
        path: 'registry',
        canActivate: [roleGuard],
        data: {role: UserRoleEnum.MEMBER},
        loadChildren: () => import('../registry/registry.routes').then(c => c.RegistryRoutes)
      },
      {
        path: 'profile',
        canActivate: [roleGuard],
        data: {role: UserRoleEnum.CANDIDATE},
        loadChildren: () => import('../profile/profile.routes').then(c => c.ProfileRoutes)
      },
      {
        path: 'feed',
        canActivate: [roleGuard],
        data: {role: UserRoleEnum.MEMBER},
        loadChildren: () => import('../feed/feed.routes').then(c => c.FeedRoutes)
      },
      {
        path: '**',
        redirectTo: 'dashboard'
      }
    ]
  },

];
