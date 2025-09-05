// Configuration des routes de l'application
export const ROUTES = {
  // Routes publiques
  public: {
    home: '/',
    login: '/auth/login',
    register: '/auth/register',
  },

  // Routes protégées (nécessitent une authentification)
  protected: {
    profile: '/profile',
    admin: {
      dashboard: '/admin',
      products: '/admin/products',
      orders: '/admin/orders',
      users: '/admin/users',
    },
  },

  // Routes API
  api: {
    auth: {
      login: '/api/auth/login',
      register: '/api/auth/register',
      me: '/api/auth/me',
    },
    admin: {
      foods: '/api/admin/foods',
      drinks: '/api/admin/drinks',
      desserts: '/api/admin/desserts',
      sauces: '/api/admin/sauces',
      sides: '/api/admin/sides',
    },
  },
} as const;

// Routes qui nécessitent une authentification
export const PROTECTED_PATHS = new Set([
  ROUTES.protected.profile,
  ...Object.values(ROUTES.protected.admin),
]);

// Routes qui nécessitent des droits administrateur
export const ADMIN_PATHS = new Set([
  ...Object.values(ROUTES.protected.admin),
]);

// Routes API qui nécessitent une authentification
export const PROTECTED_API_PATHS = new Set([
  ...Object.values(ROUTES.api.admin),
]);

// Routes API qui nécessitent des droits administrateur
export const ADMIN_API_PATHS = new Set([
  ...Object.values(ROUTES.api.admin),
]);
