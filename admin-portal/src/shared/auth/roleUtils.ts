import type { AuthRole, AuthSession } from './types';

export function hasRequiredRole(session: AuthSession | null, allowedRoles: AuthRole[]) {
  if (!session) {
    return false;
  }

  return allowedRoles.includes(session.user.role);
}

