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
        loadChildren: () => import('../dashboard/dashboard.routes').then(c => c.DashboardRoutes),
        data: {animation: 'dashboard'}
      },
      {
        path: 'events',
        canActivate: [roleGuard],
        data: {role: UserRoleEnum.MEMBER, animation: 'events'},
        loadChildren: () => import('../events/events.routes').then(c => c.EventsRoutes)
      },
      {
        path: 'eternal-harvest',
        canActivate: [roleGuard],
        data: {role: UserRoleEnum.MEMBER, animation: 'eternal-harvest'},
        loadChildren: () => import('../eternal-harvest/eternal-harvest.routes').then(c => c.EternalHarvestRoutes)
      },
      {
        path: 'guild',
        canActivate: [roleGuard],
        data: {role: UserRoleEnum.MEMBER, animation: 'guild'},
        loadChildren: () => import('../guild/guild.routes').then(c => c.GuildRoutes)
      },
      {
        path: 'registry',
        canActivate: [roleGuard],
        data: {role: UserRoleEnum.MEMBER, animation: 'registry'},
        loadChildren: () => import('../registry/registry.routes').then(c => c.RegistryRoutes)
      },
      {
        path: 'profile',
        canActivate: [roleGuard],
        data: {role: UserRoleEnum.CANDIDATE, animation: 'profile'},
        loadChildren: () => import('../profile/profile.routes').then(c => c.ProfileRoutes)
      },
      {
        path: 'feed',
        canActivate: [roleGuard],
        data: {role: UserRoleEnum.MEMBER, animation: 'dashboard'},
        loadChildren: () => import('../feed/feed.routes').then(c => c.FeedRoutes)
      },
      {
        path: '**',
        redirectTo: 'dashboard',
        data: {animation: 'notFound'}
      }
    ]
  },
];
