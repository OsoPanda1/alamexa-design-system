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
    description: 'Descubre ALAMEXA, la plataforma de comercio inteligente con trueque P2P.',
    category: 'landing',
    requiresAuth: false,
    allowedRoles: ['guest', 'user', 'admin', 'moderator'],
    navVisible: true,
    navGroup: 'main',
    navOrder: 0,
    seo: {
      title: 'ALAMEXA | La Nueva Era del Comercio Inteligente',
      description: 'Plataforma innovadora de comercio con sistema de trueque seguro. Compra, vende e intercambia con confianza.',
      keywords: ['trueque', 'intercambio', 'México', 'P2P', 'marketplace', 'comercio inteligente'],
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
    id: 'marketplace',
    path: '/marketplace',
    label: 'Marketplace',
    labelEs: 'Marketplace',
    description: 'Explora miles de productos para comprar, vender o intercambiar.',
    category: 'core',
    requiresAuth: false,
    allowedRoles: ['guest', 'user', 'admin', 'moderator'],
    navVisible: true,
    navGroup: 'main',
    navOrder: 1,
    seo: {
      title: 'Marketplace | ALAMEXA',
      description: 'Explora productos para comprar, vender o intercambiar. Sistema de trueque seguro y verificado.',
      keywords: ['marketplace', 'productos', 'trueque', 'comprar', 'vender'],
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
  },
  {
    id: 'catalog',
    path: '/catalog',
    label: 'Catalog',
    labelEs: 'Catálogo',
    description: 'Explora el catálogo completo de productos.',
    category: 'core',
    requiresAuth: false,
    allowedRoles: ['guest', 'user', 'admin', 'moderator'],
    navVisible: true,
    navGroup: 'main',
    navOrder: 2,
    seo: {
      title: 'Catálogo | ALAMEXA',
      description: 'Explora el catálogo completo de productos disponibles.',
      keywords: ['catálogo', 'productos', 'búsqueda'],
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
  },
  {
    id: 'trades',
    path: '/trades',
    label: 'Trades',
    labelEs: 'Trueques',
    description: 'Gestiona tus propuestas e intercambios.',
    category: 'trading',
    requiresAuth: true,
    allowedRoles: ['user', 'admin', 'moderator'],
    navVisible: true,
    navGroup: 'main',
    navOrder: 3,
    seo: {
      title: 'Mis Trueques | ALAMEXA',
      description: 'Gestiona tus propuestas de trueque, acepta ofertas y completa intercambios.',
      keywords: ['trueques', 'intercambios', 'propuestas'],
    },
    analytics: {
      pageType: 'dashboard',
      funnelStep: 'engagement',
      critical: false,
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
    id: 'auth',
    path: '/auth',
    label: 'Login',
    labelEs: 'Entrar',
    description: 'Inicia sesión o crea tu cuenta.',
    category: 'auth',
    requiresAuth: false,
    allowedRoles: ['guest'],
    navVisible: false,
    seo: {
      title: 'Acceso | ALAMEXA',
      description: 'Crea tu cuenta gratuita o inicia sesión en ALAMEXA.',
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
    description: 'Revisa los productos en tu carrito.',
    category: 'core',
    requiresAuth: true,
    allowedRoles: ['user', 'admin', 'moderator'],
    navVisible: false,
    seo: {
      title: 'Carrito | ALAMEXA',
      description: 'Revisa y gestiona los productos en tu carrito.',
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
    description: 'Gestiona tu perfil y configuración.',
    category: 'social',
    requiresAuth: true,
    allowedRoles: ['user', 'admin', 'moderator'],
    navVisible: true,
    navGroup: 'secondary',
    navOrder: 10,
    seo: {
      title: 'Mi Cuenta | ALAMEXA',
      description: 'Gestiona tu perfil, métodos de pago e historial.',
      keywords: ['perfil', 'cuenta', 'configuración'],
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
    description: 'Compara planes y membresías.',
    category: 'billing',
    requiresAuth: false,
    allowedRoles: ['guest', 'user', 'admin', 'moderator'],
    navVisible: true,
    navGroup: 'main',
    navOrder: 5,
    seo: {
      title: 'Membresías y Planes | ALAMEXA',
      description: 'Compara planes Free, Premium y Elite para maximizar tu experiencia.',
      keywords: ['planes', 'membresía', 'pro', 'precios'],
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
  {
    id: 'about',
    path: '/about',
    label: 'About',
    labelEs: 'Sobre ALAMEXA',
    description: 'Conoce más sobre ALAMEXA.',
    category: 'landing',
    requiresAuth: false,
    allowedRoles: ['guest', 'user', 'admin', 'moderator'],
    navVisible: true,
    navGroup: 'footer',
    navOrder: 1,
    seo: {
      title: 'Sobre ALAMEXA | La Nueva Era del Comercio',
      description: 'ALAMEXA fusiona lo mejor de los marketplaces modernos con un sistema de trueque seguro.',
      keywords: ['sobre nosotros', 'ALAMEXA', 'misión', 'visión'],
    },
    analytics: {
      pageType: 'landing',
      funnelStep: 'awareness',
      critical: false,
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
    id: 'devhub',
    path: '/devhub',
    label: 'DevHub',
    labelEs: 'DevHub',
    description: 'Registro para desarrolladores TAMV.',
    category: 'social',
    requiresAuth: true,
    allowedRoles: ['user', 'admin', 'moderator'],
    navVisible: true,
    navGroup: 'secondary',
    navOrder: 20,
    seo: {
      title: 'DevHub | Registro TAMV',
      description: 'Únete al gremio de desarrolladores TAMV y accede a beneficios exclusivos.',
      keywords: ['desarrolladores', 'TAMV', 'DevHub', 'membresía'],
    },
    analytics: {
      pageType: 'landing',
      funnelStep: 'monetization',
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
