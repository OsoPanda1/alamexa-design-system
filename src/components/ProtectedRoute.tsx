import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import { useSeo } from '@/hooks/useSeo';
import { getRouteByPath, canAccessRoute, type RouteMeta } from '@/config/routes';

interface ProtectedRouteProps {
  children: React.ReactNode;
  routeId?: string;
}

export function ProtectedRoute({ children, routeId }: ProtectedRouteProps) {
  const location = useLocation();
  const { user, loading: authLoading } = useAuth();
  const { role, loading: roleLoading } = useUserRole();
  
  // Get route metadata
  const route = getRouteByPath(location.pathname);
  
  // Apply SEO
  useSeo();

  const isLoading = authLoading || roleLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 rounded-lg bg-gradient-silver flex items-center justify-center animate-pulse">
            <span className="text-deep-black font-bold text-lg font-serif">A</span>
          </div>
          <p className="text-muted-foreground text-sm">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!route) {
    return <>{children}</>;
  }

  const isAuthenticated = !!user;
  const hasAccess = canAccessRoute(route, role, isAuthenticated);

  // Redirect to auth if authentication required
  if (route.requiresAuth && !isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Redirect to home if user doesn't have required role
  if (!hasAccess) {
    return <Navigate to="/" replace />;
  }

  // Redirect authenticated users away from auth page
  if (route.id === 'auth' && isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

// HOC for wrapping page components
export function withProtectedRoute<P extends object>(
  Component: React.ComponentType<P>,
  routeId?: string
) {
  return function WrappedComponent(props: P) {
    return (
      <ProtectedRoute routeId={routeId}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
}
