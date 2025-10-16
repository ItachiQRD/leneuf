import Link from 'next/link';
import { useRouter } from 'next/router';
import { ShoppingCart, Menu, User, Shield, LogOut, Sun, Moon } from 'lucide-react';
import { useHeaderColor } from '@/hooks/useHeaderColor';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import Image from 'next/image';

interface MainHeaderProps {
  onOpenCart: () => void;
}

export default function MainHeader({ onOpenCart }: MainHeaderProps) {
  const router = useRouter();
  const { itemCount } = useCart();
  const { backgroundColor, textColor, borderColor, boxShadow } = useHeaderColor();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { href: '/', label: 'Accueil' },
    { href: '/menu', label: 'Menu' },
    { href: '/a-propos', label: 'À propos' },
    { href: '/contact', label: 'Contact' },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${backgroundColor} ${borderColor} ${boxShadow}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo / Home Link */}
          <Link 
            href="/"
            className="flex items-center hover:opacity-80 transition-opacity"
          >
            <Image
              src="/images/logo.png"
              alt="Le 9 Logo"
              width={60}
              height={60}
              className=""
              style={{ width: 'auto', height: 'auto' }}
            />
          </Link>

          {/* Navigation centrée */}
          <div className="hidden md:flex items-center space-x-12">
            <Link
              href="/contact"
              className={`${textColor} hover:text-primary transition-colors font-medium text-sm`}
            >
              Contact
            </Link>
            <Link
              href="/menu"
              className={`${textColor} hover:text-primary transition-colors font-bold text-xl`}
            >
              Menu
            </Link>
            <Link
              href="/commander"
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-3 rounded-full font-bold text-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              🍔 Commander
            </Link>
            <Link
              href="/promos"
              className={`${textColor} hover:text-primary transition-colors font-bold text-xl`}
            >
              Promos
            </Link>
            <Link
              href="/a-propos"
              className={`${textColor} hover:text-primary transition-colors font-medium text-sm`}
            >
              À propos
            </Link>
          </div>

          {/* Actions à droite */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg hover:bg-gray-100/10 transition-colors ${textColor}`}
              aria-label={theme === 'dark' ? 'Mode clair' : 'Mode sombre'}
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            {/* Auth */}
            {isAuthenticated ? (
              <div className="relative group">
                <button 
                  className={`flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100/10 ${textColor}`}
                >
                  <User className="w-5 h-5" />
                  <span className={`${textColor} text-sm font-medium`}>
                    {user?.name || 'Profil'}
                  </span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="py-1">
                    <Link
                      href="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Mon Profil
                    </Link>
                    {user?.isAdmin && (
                      <Link
                        href="/admin"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <Shield className="w-4 h-4 mr-2" />
                        Administration
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Déconnexion
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                href="/auth/login"
                className={`flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100/10 ${textColor}`}
              >
                <User className="w-5 h-5" />
                <span className={`${textColor} text-sm font-medium`}>
                  Connexion
                </span>
              </Link>
            )}

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className={`relative p-2 hover:bg-gray-100/10 rounded-lg ${textColor}`}
              aria-label="Panier"
            >
              <ShoppingCart className="w-6 h-6" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  {itemCount}
                </span>
              )}
            </button>
          </div>

          {/* Bouton Commander au centre - Mobile */}
          <div className="md:hidden">
            <Link
              href="/commander"
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-3 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              🍔 Commander
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {isMobileMenuOpen ? (
              <Menu className="w-7 h-7" />
            ) : (
              <Menu className="w-7 h-7" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-20 right-0 w-full max-w-sm">
            <nav className={`flex flex-col space-y-4 p-6 rounded-bl-xl shadow-lg ${
              isScrolled 
                ? 'bg-white dark:bg-gray-900' 
                : 'bg-white/95 backdrop-blur-sm'
            }`}>
              {/* Connexion/Profil en mobile */}
              {isAuthenticated ? (
                <div className="space-y-2">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {user?.name || 'Mon compte'}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Connecté
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Link
                      href="/profile"
                      className="flex items-center space-x-3 text-lg font-medium text-gray-700 dark:text-gray-300 hover:text-primary"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <User className="w-5 h-5" />
                      <span>Mon Profil</span>
                    </Link>
                    {user?.isAdmin && (
                      <Link
                        href="/admin"
                        className="flex items-center space-x-3 text-lg font-medium text-gray-700 dark:text-gray-300 hover:text-primary"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Shield className="w-5 h-5" />
                        <span>Administration</span>
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center space-x-3 text-lg font-medium text-red-600 hover:text-red-700 w-full text-left"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Déconnexion</span>
                    </button>
                  </div>
                </div>
              ) : (
                <Link
                  href="/auth/login"
                  className="flex items-center space-x-3 text-lg font-medium text-gray-700 dark:text-gray-300 hover:text-primary p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <User className="w-5 h-5" />
                  <span>Connexion</span>
                </Link>
              )}
              
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-4">
                <Link
                  href="/contact"
                  className={`flex items-center space-x-3 text-lg font-medium ${
                    isScrolled
                      ? 'text-gray-700 dark:text-gray-300'
                      : 'text-gray-900'
                  } hover:text-primary`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>Contact</span>
                </Link>
                <Link
                  href="/menu"
                  className={`flex items-center space-x-3 text-lg font-medium ${
                    isScrolled
                      ? 'text-gray-700 dark:text-gray-300'
                      : 'text-gray-900'
                  } hover:text-primary`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                  <span>Menu</span>
                </Link>
                <Link
                  href="/promos"
                  className={`flex items-center space-x-3 text-lg font-medium ${
                    isScrolled
                      ? 'text-gray-700 dark:text-gray-300'
                      : 'text-gray-900'
                  } hover:text-primary`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <span>Promos</span>
                </Link>
                <Link
                  href="/a-propos"
                  className={`flex items-center space-x-3 text-lg font-medium ${
                    isScrolled
                      ? 'text-gray-700 dark:text-gray-300'
                      : 'text-gray-900'
                  } hover:text-primary`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>À propos</span>
                </Link>
              </div>
              <button
                onClick={() => {
                  onOpenCart();
                  setIsMobileMenuOpen(false);
                }}
                className={`flex items-center space-x-2 text-lg font-medium ${
                  isScrolled
                    ? 'text-gray-700 dark:text-gray-300'
                    : 'text-gray-900'
                } hover:text-primary`}
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Panier</span>
              </button>
              {isAuthenticated ? (
                <>
                  <Link
                    href="/profile"
                    className={`flex items-center space-x-2 text-lg font-medium ${
                      isScrolled
                        ? 'text-gray-700 dark:text-gray-300'
                        : 'text-gray-900'
                    } hover:text-primary`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User className="w-5 h-5" />
                    <span>Mon Profil</span>
                  </Link>
                  {user?.isAdmin && (
                    <Link
                      href="/admin"
                      className={`flex items-center space-x-2 text-lg font-medium ${
                        isScrolled
                          ? 'text-gray-700 dark:text-gray-300'
                          : 'text-gray-900'
                      } hover:text-primary`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Shield className="w-5 h-5" />
                      <span>Administration</span>
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center space-x-2 text-lg font-medium text-red-600 hover:text-red-700"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Déconnexion</span>
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className={`flex items-center space-x-2 text-lg font-medium ${
                    isScrolled
                      ? 'text-primary hover:text-primary-600'
                      : 'text-primary hover:text-primary-700'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <User className="w-5 h-5" />
                  <span>Connexion</span>
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </motion.header>
  );
}