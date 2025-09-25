import Link from 'next/link';
import { useRouter } from 'next/router';
import { ShoppingCart, Menu } from 'lucide-react';
import { useHeaderColor } from '@/hooks/useHeaderColor';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { Sun, Moon, User, LogOut, Shield } from 'lucide-react';
import Image from 'next/image';

interface MainHeaderProps {
  onOpenCart: () => void;
}

export default function MainHeader({ onOpenCart }: MainHeaderProps) {
  const router = useRouter();
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

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            {/* Liens à gauche */}
            <Link
              href="/menu"
              className={`${textColor} hover:text-primary transition-colors font-medium`}
            >
              Menu
            </Link>
            <Link
              href="/promo"
              className={`${textColor} hover:text-primary transition-colors font-medium`}
            >
              Promo
            </Link>
          </nav>

          {/* Bouton Commander au centre */}
          <div className="hidden md:flex">
            <Link
              href="/commander"
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-3 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              🍔 Commander
            </Link>
          </div>

          {/* Liens à droite */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/contact"
              className={`${textColor} hover:text-primary transition-colors font-medium`}
            >
              Contact
            </Link>
            <Link
              href="/about"
              className={`${textColor} hover:text-primary transition-colors font-medium`}
            >
              À Propos
            </Link>
          </nav>

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
              className={`p-2 hover:bg-gray-100/10 rounded-lg ${textColor}`}
              aria-label="Panier"
            >
              <ShoppingCart className="w-6 h-6" />
            </button>
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
              {/* Bouton Commander en mobile */}
              <Link
                href="/commander"
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-full font-bold text-lg text-center shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                🍔 Commander
              </Link>
              
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <Link
                  href="/menu"
                  className={`text-lg font-medium ${
                    isScrolled
                      ? 'text-gray-700 dark:text-gray-300'
                      : 'text-gray-900'
                  } hover:text-primary`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Menu
                </Link>
                <Link
                  href="/promo"
                  className={`text-lg font-medium ${
                    isScrolled
                      ? 'text-gray-700 dark:text-gray-300'
                      : 'text-gray-900'
                  } hover:text-primary`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Promo
                </Link>
                <Link
                  href="/contact"
                  className={`text-lg font-medium ${
                    isScrolled
                      ? 'text-gray-700 dark:text-gray-300'
                      : 'text-gray-900'
                  } hover:text-primary`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Contact
                </Link>
                <Link
                  href="/about"
                  className={`text-lg font-medium ${
                    isScrolled
                      ? 'text-gray-700 dark:text-gray-300'
                      : 'text-gray-900'
                  } hover:text-primary`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  À Propos
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