import {Route} from "@angular/router";

export const RegistryRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./containers/registry/registry.component').then(c => c.RegistryComponent),
    children: [
      {
        path: 'users',
        loadComponent: () => import('./containers/users-registry/users-registry.component').then(c => c.UsersRegistryComponent),
      },
      {
        path: 'guilds',
        loadComponent: () => import('./containers/guilds-registry/guilds-registry.component').then(c => c.GuildsRegistryComponent),
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'users',
      }
    ]
  },
  {
    path: 'user/:username',
    loadComponent: () => import('../profile/containers/profile/profile.component').then(c => c.ProfileComponent),
  },
  {
    path: 'guild/:guildId',
    loadComponent: () => import('../guild/containers/guild-details/guild-details.component').then(c => c.GuildDetailsComponent),
  },
  {
    path: '**',
    redirectTo: 'users',
  }
];

