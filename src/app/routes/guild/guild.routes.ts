import {Route} from "@angular/router";

export const GuildRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./containers/guild/guild.component').then(c => c.GuildComponent)
  },
  {
    path: ':guildId',
    loadComponent: () => import('./containers/guild/guild.component').then(c => c.GuildComponent)
  }
]
