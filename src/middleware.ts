import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyTokenEdge } from '@/utils/jwt';

// Routes qui ne nécessitent pas d'authentification
const publicRoutes = [
  '/auth/login',
  '/auth/register',
  '/api/auth/login',
  '/api/auth/register',
  '/',
  '/menu',
  '/menu/',
  '/menu/burgers',
  '/menu/pizzas',
  '/menu/salads',
  '/menu/plates',
  '/menu/paninis',
  '/menu/tacos',
  '/menu/drinks',
  '/menu/sides',
  '/menu/desserts',
  '/menu/sauces',
  '/commander',
  '/a-propos',
  '/about',
  '/contact',
  '/checkout',
  '/commande-formulaire',
  '/api/public',
  '/api/menu',
  '/api/products',
  '/api/orders'
];

// Routes qui nécessitent des droits d'administrateur
const adminRoutes = [
  '/admin',
  '/api/admin',
];

interface JWTPayload {
  userId: string;
  email: string;
  isAdmin: boolean;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Ignorer les routes publiques et les fichiers statiques
  if (publicRoutes.some(route => pathname.startsWith(route)) || 
      pathname.startsWith('/_next') ||
      pathname.startsWith('/static') ||
      pathname.startsWith('/favicon') ||
      pathname.startsWith('/images') ||
      pathname.startsWith('/uploads') ||
      pathname.includes('.')) {
    return NextResponse.next();
  }

  // Seules les routes admin nécessitent une authentification
  if (adminRoutes.some(route => pathname.startsWith(route))) {
    // L'authentification sera gérée côté API pour les routes admin
    return NextResponse.next();
  }

  // Toutes les autres routes sont publiques
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Seulement les routes admin et auth
    '/admin/:path*',
    '/api/admin/:path*',
    '/api/auth/:path*'
  ],
};