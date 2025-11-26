export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  LOGIN: '/login',
  SIGNUP: '/signup',
  FORGOT_PASSWORD: '/forgot-password',
  DASHBOARD: '/dashboard',
  DASHBOARD_COMPONENT1: '/dashboard/component1',
  DASHBOARD_COMPONENT2: '/dashboard/component2',
  DASHBOARD_COMPONENT3: '/dashboard/component3',
  DASHBOARD_COMPONENT4: '/dashboard/component4',
  DASHBOARD_COMPONENT5: '/dashboard/component5',
} as const;

export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
} as const;

