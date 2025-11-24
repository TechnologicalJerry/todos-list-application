import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth-guard';
import { userResolver } from './core/resolvers/user-resolver';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    title: 'Home',
    loadComponent: () => import('./features/home/home').then((m) => m.Home),
  },
  {
    path: 'about',
    title: 'About',
    loadComponent: () => import('./features/about/about').then((m) => m.About),
  },
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        title: 'Login',
        loadComponent: () =>
          import('./features/auth/login/login').then((m) => m.Login),
      },
      {
        path: 'signup',
        title: 'Create Account',
        loadComponent: () =>
          import('./features/auth/signup/signup').then((m) => m.Signup),
      },
      {
        path: 'forgot-password',
        title: 'Forgot Password',
        loadComponent: () =>
          import('./features/auth/forgot-password/forgot-password').then(
            (m) => m.ForgotPassword,
          ),
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'login',
      },
    ],
  },
  {
    path: 'dashboard',
    title: 'Dashboard',
    canActivate: [authGuard],
    resolve: {
      userReady: userResolver,
    },
    loadComponent: () =>
      import('./features/dashboard/dashboard').then((m) => m.Dashboard),
  },
  {
    path: 'profile',
    title: 'Profile',
    loadComponent: () =>
      import('./features/dashboard/components/profile/profile').then(
        (m) => m.Profile,
      ),
  },
  {
    path: 'todos',
    title: 'Todos',
    loadComponent: () =>
      import('./features/dashboard/components/todos/todos').then(
        (m) => m.Todos,
      ),
  },
  {
    path: 'not-found',
    title: 'Not Found',
    loadComponent: () =>
      import('./shared/components/not-found/not-found').then(
        (m) => m.NotFound,
      ),
  },
  {
    path: '**',
    redirectTo: 'not-found',
  },
];
