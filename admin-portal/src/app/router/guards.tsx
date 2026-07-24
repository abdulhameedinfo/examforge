import type { PropsWithChildren } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import type { AuthRole } from '../../shared/auth/types';
import { routePaths } from './routePaths';
import { hasRequiredRole } from '../../shared/auth/roleUtils';
import { useAuthStore } from '../../features/auth/store/useAuthStore';

type ProtectedRouteProps = PropsWithChildren<{
  allowedRoles: AuthRole[];
}>;

export function ProtectedRoute({ allowedRoles, children }: ProtectedRouteProps) {
  const location = useLocation();
  const session = useAuthStore((state) => state.session);

  if (!hasRequiredRole(session, allowedRoles)) {
    return <Navigate to={routePaths.login} replace state={{ from: location }} />;
  }

  return children ?? <Outlet />;
}

export function PublicRoute({ children }: PropsWithChildren) {
  const session = useAuthStore((state) => state.session);

  if (hasRequiredRole(session, ['Administrator'])) {
    return <Navigate to={routePaths.dashboard} replace />;
  }

  return children ?? <Outlet />;
}

export function RouteFallback() {
  const session = useAuthStore((state) => state.session);

  if (hasRequiredRole(session, ['Administrator'])) {
    return <Navigate to={routePaths.dashboard} replace />;
  }

  return <Navigate to={routePaths.login} replace />;
}

