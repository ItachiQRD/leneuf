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
  '/about',
  '/contact',
  '/api/public'
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
      pathname.includes('.')) {
    return NextResponse.next();
  }

  // Pour l'instant, on laisse passer toutes les requêtes
  // L'authentification sera gérée côté API
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api/public|_next/static|_next/image|favicon.ico).*)',
  ],
};