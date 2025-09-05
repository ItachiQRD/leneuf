import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/utils/jwt';

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

  // Vérifier le token
  const token = request.cookies.get('token')?.value;

  if (!token) {
    // Rediriger vers la page de connexion si pas de token
    if (pathname.startsWith('/api')) {
      return NextResponse.json(
        { message: 'Non authentifié' },
        { status: 401 }
      );
    }
    const url = new URL('/auth/login', request.url);
    url.searchParams.set('returnUrl', pathname);
    return NextResponse.redirect(url);
  }

  try {
    // Vérifier et décoder le token
    const decoded = verifyToken(token) as JWTPayload;

    if (!decoded) {
      throw new Error('Token invalide');
    }

    // Vérifier les droits d'admin pour les routes admin
    if (adminRoutes.some(route => pathname.startsWith(route)) && !decoded.isAdmin) {
      if (pathname.startsWith('/api')) {
        return NextResponse.json(
          { message: 'Accès non autorisé' },
          { status: 403 }
        );
      }
      return NextResponse.redirect(new URL('/', request.url));
    }

    // Ajouter les informations utilisateur à la requête
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('user', JSON.stringify(decoded));

    // Continuer avec la requête modifiée
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    // Token invalide ou expiré
    if (pathname.startsWith('/api')) {
      return NextResponse.json(
        { message: 'Token invalide' },
        { status: 401 }
      );
    }
    const url = new URL('/auth/login', request.url);
    url.searchParams.set('returnUrl', pathname);
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: [
    '/((?!api/public|_next/static|_next/image|favicon.ico).*)',
  ],
};