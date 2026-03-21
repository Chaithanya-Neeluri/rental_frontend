import { ROLES } from '../constants/roles.js';

// Centralized navigation helpers keep routing concerns out of UI components
export const getRoleLandingPath = (role) => {
  if (role === ROLES.TENANT) return '/tenant';
  if (role === ROLES.OWNER) return '/owner';
  return '/';
};

export const getRoleDashboardPath = (role) => {
  if (role === ROLES.TENANT) return '/tenant/dashboard';
  if (role === ROLES.OWNER) return '/owner/dashboard';
  if (role === ROLES.ADMIN) return '/admin/dashboard';
  return '/';
};

