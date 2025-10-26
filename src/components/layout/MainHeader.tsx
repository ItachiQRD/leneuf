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
          {/* Actions à gauche - Theme Toggle */}
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className={`hidden md:block p-2 rounded-lg hover:bg-gray-100/10 transition-colors ${textColor}`}
              aria-label={theme === 'dark' ? 'Mode clair' : 'Mode sombre'}
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            {/* Logo - Mobile only */}
            <div className="md:hidden">
              <Link 
                href="/"
                className="flex items-center hover:opacity-80 transition-opacity"
              >
                <Image
                  src="/images/logo.png"
                  alt="Le 9 Logo"
                  width={40}
                  height={40}
                  className=""
                  style={{ width: 'auto', height: 'auto' }}
                />
              </Link>
            </div>
          </div>

          {/* Navigation centrée avec logo au milieu - Desktop */}
          <div className="hidden md:flex items-center space-x-8 flex-1 justify-center">
            <Link
              href="/menu"
              className={`${textColor} hover:text-red-600 transition-colors font-semibold text-lg`}
            >
              Menu
            </Link>
            <Link
              href="/a-propos"
              className={`${textColor} hover:text-red-600 transition-colors font-semibold text-lg`}
            >
              À propos
            </Link>
            
            {/* Logo au centre - GROS */}
            <Link 
              href="/"
              className="flex items-center hover:opacity-80 transition-opacity mx-4"
            >
              <Image
                src="/images/logo.png"
                alt="Le 9 Logo"
                width={120}
                height={120}
                className=""
                style={{ width: 'auto', height: 'auto' }}
              />
            </Link>
            
            <Link
              href="/commander"
              className={`${textColor} hover:text-red-600 transition-colors font-semibold text-lg`}
            >
              Commander
            </Link>
            <Link
              href="/contact"
              className={`${textColor} hover:text-red-600 transition-colors font-semibold text-lg`}
            >
              Contact
            </Link>
          </div>

          {/* Actions à droite */}
          <div className="flex items-center space-x-2">
            {/* Auth - Desktop only */}
            <div className="hidden md:block">
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
            </div>

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

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Menu className="w-7 h-7" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-lg">
            <nav className="flex flex-col p-6 space-y-4">
              <Link
                href="/menu"
                className={`flex items-center space-x-3 text-lg font-medium ${textColor}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span>📋</span>
                <span>Menu</span>
              </Link>
              <Link
                href="/a-propos"
                className={`flex items-center space-x-3 text-lg font-medium ${textColor}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span>ℹ️</span>
                <span>À propos</span>
              </Link>
              <Link
                href="/commander"
                className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-lg font-bold text-lg text-center hover:from-red-700 hover:to-red-800 transition-all duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                🍔 Commander
              </Link>
              <Link
                href="/contact"
                className={`flex items-center space-x-3 text-lg font-medium ${textColor}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span>📧</span>
                <span>Contact</span>
              </Link>
              
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <button
                  onClick={() => {
                    onOpenCart();
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center space-x-3 text-lg font-medium ${textColor} w-full`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Panier ({itemCount})</span>
                </button>
              </div>

              {isAuthenticated ? (
                <>
                  <Link
                    href="/profile"
                    className={`flex items-center space-x-3 text-lg font-medium ${textColor}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User className="w-5 h-5" />
                    <span>Mon Profil</span>
                  </Link>
                  {user?.isAdmin && (
                    <Link
                      href="/admin"
                      className={`flex items-center space-x-3 text-lg font-medium ${textColor}`}
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
                </>
              ) : (
                <Link
                  href="/auth/login"
                  className={`flex items-center space-x-3 text-lg font-medium ${textColor}`}
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
