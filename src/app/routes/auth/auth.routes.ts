import {Routes} from "@angular/router";

export const authRoutes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./containers/login/login.component').then(c => c.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./containers/register/register.component').then(c => c.RegisterComponent),
  },
  {
    path: 'register/leader',
    loadComponent: () => import('./containers/register-leader/register-leader.component').then(c => c.RegisterLeaderComponent)
  },
  {
    path: 'register/member',
    loadComponent: () => import('./containers/register-member/register-member.component').then(c => c.RegisterMemberComponent),
    children: [
      {
        path: 'guild-selection',
        loadComponent: () => import('./containers/guild-selection/guild-selection.component').then(c => c.GuildSelectionComponent)
      },
    ]
  },
  {
    path: '**',
    redirectTo: 'login',
  }
];
