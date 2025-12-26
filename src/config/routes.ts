// ALAMEXA Route Configuration with Metadata
// Defines all routes with SEO, permissions, analytics, and layout settings

export type UserRole = 'guest' | 'user' | 'admin' | 'moderator';

export interface RouteMeta {
  id: string;
  path: string;
  label: string;
  labelEs: string;
  icon?: string;
  description?: string;
  category?: 'landing' | 'auth' | 'core' | 'trading' | 'social' | 'billing' | 'admin';
  requiresAuth: boolean;
  allowedRoles: UserRole[];
  navVisible: boolean;
  navGroup?: 'main' | 'secondary' | 'footer';
  navOrder?: number;
  seo: {
    title: string;
    description: string;
    keywords: string[];
    canonical?: string;
  };
  analytics?: {
    pageType: 'landing' | 'dashboard' | 'listing' | 'detail' | 'admin' | 'checkout';
    funnelStep?: string;
    critical?: boolean;
  };
  layout?: {
    fullWidth?: boolean;
    showSidebar?: boolean;
    showBreadcrumbs?: boolean;
    showHeader?: boolean;
    showFooter?: boolean;
  };
  featureFlags?: string[];
}

export const ROUTES: RouteMeta[] = [
  {
    id: 'landing',
    path: '/',
    label: 'Home',
    labelEs: 'Inicio',
    description: 'Descubre Alamexa, la plataforma de trueque digital P2P con reputación y membresías.',
    category: 'landing',
    requiresAuth: false,
    allowedRoles: ['guest', 'user', 'admin', 'moderator'],
    navVisible: true,
    navGroup: 'main',
    navOrder: 0,
    seo: {
      title: 'Alamexa | Trueque Digital P2P México',
      description: 'Plataforma mexicana de trueque digital P2P. Convierte tus productos en nuevas oportunidades. Intercambia con confianza.',
      keywords: ['trueque', 'intercambio', 'México', 'P2P', 'marketplace', 'segunda mano'],
      canonical: 'https://alamexa.com/',
    },
    analytics: {
      pageType: 'landing',
      funnelStep: 'awareness',
      critical: true,
    },
    layout: {
      fullWidth: true,
      showSidebar: false,
      showBreadcrumbs: false,
      showHeader: true,
      showFooter: true,
    },
  },
  {
    id: 'catalog',
    path: '/catalog',
    label: 'Catalog',
    labelEs: 'Catálogo',
    description: 'Explora publicaciones activas para trueque en tu ciudad.',
    category: 'core',
    requiresAuth: false,
    allowedRoles: ['guest', 'user', 'admin', 'moderator'],
    navVisible: true,
    navGroup: 'main',
    navOrder: 1,
    seo: {
      title: 'Catálogo | Alamexa',
      description: 'Explora productos disponibles para trueque. Encuentra lo que buscas y ofrece lo que tienes.',
      keywords: ['catálogo', 'productos', 'trueque', 'intercambio', 'búsqueda'],
    },
    analytics: {
      pageType: 'listing',
      funnelStep: 'exploration',
      critical: true,
    },
    layout: {
      fullWidth: true,
      showSidebar: true,
      showBreadcrumbs: true,
      showHeader: true,
      showFooter: true,
    },
    featureFlags: ['search_v2', 'boost_badges'],
  },
  {
    id: 'auth',
    path: '/auth',
    label: 'Login',
    labelEs: 'Entrar',
    description: 'Inicia sesión o crea tu cuenta para empezar a truequear.',
    category: 'auth',
    requiresAuth: false,
    allowedRoles: ['guest'],
    navVisible: false,
    seo: {
      title: 'Acceso | Alamexa',
      description: 'Crea tu cuenta gratuita o inicia sesión en Alamexa para comenzar a truequear.',
      keywords: ['login', 'registro', 'cuenta', 'acceso'],
      canonical: 'https://alamexa.com/auth',
    },
    analytics: {
      pageType: 'landing',
      funnelStep: 'activation',
      critical: true,
    },
    layout: {
      fullWidth: false,
      showSidebar: false,
      showBreadcrumbs: false,
      showHeader: true,
      showFooter: false,
    },
  },
  {
    id: 'cart',
    path: '/cart',
    label: 'Cart',
    labelEs: 'Carrito',
    description: 'Revisa los productos en tu carrito antes de proceder.',
    category: 'core',
    requiresAuth: true,
    allowedRoles: ['user', 'admin', 'moderator'],
    navVisible: false,
    seo: {
      title: 'Carrito | Alamexa',
      description: 'Revisa y gestiona los productos en tu carrito de compras.',
      keywords: ['carrito', 'compras', 'checkout'],
    },
    analytics: {
      pageType: 'checkout',
      funnelStep: 'cart',
      critical: true,
    },
    layout: {
      fullWidth: false,
      showSidebar: false,
      showBreadcrumbs: true,
      showHeader: true,
      showFooter: true,
    },
  },
  {
    id: 'account',
    path: '/account',
    label: 'Account',
    labelEs: 'Mi Cuenta',
    description: 'Gestiona tu perfil, configuración y datos personales.',
    category: 'social',
    requiresAuth: true,
    allowedRoles: ['user', 'admin', 'moderator'],
    navVisible: true,
    navGroup: 'secondary',
    navOrder: 10,
    seo: {
      title: 'Mi Cuenta | Alamexa',
      description: 'Gestiona tu perfil, métodos de pago, historial de trueques y configuración de cuenta.',
      keywords: ['perfil', 'cuenta', 'configuración', 'datos personales'],
    },
    analytics: {
      pageType: 'dashboard',
      funnelStep: 'engagement',
      critical: false,
    },
    layout: {
      fullWidth: false,
      showSidebar: true,
      showBreadcrumbs: true,
      showHeader: true,
      showFooter: true,
    },
  },
  {
    id: 'memberships',
    path: '/memberships',
    label: 'Plans',
    labelEs: 'Membresías',
    description: 'Compara planes y membresías para maximizar tus trueques.',
    category: 'billing',
    requiresAuth: false,
    allowedRoles: ['guest', 'user', 'admin', 'moderator'],
    navVisible: true,
    navGroup: 'main',
    navOrder: 3,
    seo: {
      title: 'Membresías y Planes | Alamexa',
      description: 'Compara el plan Gratis, Membresía $199 y Pro $499 para maximizar tus trueques en Alamexa.',
      keywords: ['planes', 'membresía', 'pro', 'boosts', 'precios'],
    },
    analytics: {
      pageType: 'landing',
      funnelStep: 'monetization',
      critical: true,
    },
    layout: {
      fullWidth: true,
      showSidebar: false,
      showBreadcrumbs: false,
      showHeader: true,
      showFooter: true,
    },
  },
];

// Helper functions
export function getRouteById(id: string): RouteMeta | undefined {
  return ROUTES.find((r) => r.id === id);
}

export function getRouteByPath(pathname: string): RouteMeta | undefined {
  return ROUTES.find((r) => {
    if (r.path.includes(':')) {
      const base = r.path.split('/:')[0];
      return pathname.startsWith(base);
    }
    return r.path === pathname;
  });
}

export function getNavRoutes(group?: 'main' | 'secondary' | 'footer'): RouteMeta[] {
  return ROUTES
    .filter((r) => r.navVisible && (group ? r.navGroup === group : true))
    .sort((a, b) => (a.navOrder ?? 99) - (b.navOrder ?? 99));
}

export function canAccessRoute(route: RouteMeta, userRole: UserRole, isAuthenticated: boolean): boolean {
  if (route.requiresAuth && !isAuthenticated) {
    return false;
  }
  
  if (route.allowedRoles.length > 0 && !route.allowedRoles.includes(userRole)) {
    return false;
  }
  
  return true;
}
