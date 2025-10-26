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
        <div className="flex items-center justify-between h-24">
          {/* Actions à gauche - Theme Toggle */}
          <div className="flex items-center space-x-4 flex-1">
            <motion.button
              onClick={toggleTheme}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`hidden md:block p-3 rounded-full hover:bg-gray-100/10 dark:hover:bg-gray-800/50 transition-all duration-300 ${textColor}`}
              aria-label={theme === 'dark' ? 'Mode clair' : 'Mode sombre'}
            >
              {theme === 'dark' ? (
                <Sun className="w-6 h-6" />
              ) : (
                <Moon className="w-6 h-6" />
              )}
            </motion.button>

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
          <div className="hidden md:flex items-center space-x-6 flex-1 justify-center">
            <motion.div whileHover={{ y: -2 }}>
              <Link
                href="/menu"
                className={`${textColor} hover:text-red-600 transition-all duration-300 font-semibold text-lg px-3 py-2 relative group`}
              >
                Menu
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </motion.div>
            
            <motion.div whileHover={{ y: -2 }}>
              <Link
                href="/a-propos"
                className={`${textColor} hover:text-red-600 transition-all duration-300 font-semibold text-lg px-3 py-2 relative group`}
              >
                À propos
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </motion.div>
            
            {/* Logo au centre - TRÈS ÉLÉGANT avec animation */}
            <motion.div
              whileHover={{ scale: 1.1, rotate: [0, -5, 5, -5, 0] }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <Link 
                href="/"
                className="flex items-center hover:opacity-90 transition-opacity mx-6"
              >
                {/* Effet de halo autour du logo */}
                <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 rounded-full blur-xl opacity-20"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full blur-lg opacity-10"></div>
                
                <div className="relative transform transition-transform duration-300 hover:rotate-12">
                  <Image
                    src="/images/logo.png"
                    alt="Le 9 Logo"
                    width={140}
                    height={140}
                    className="drop-shadow-2xl"
                    style={{ width: 'auto', height: 'auto' }}
                  />
                </div>
              </Link>
            </motion.div>
            
            <motion.div whileHover={{ y: -2 }}>
              <Link
                href="/commander"
                className={`${textColor} hover:text-red-600 transition-all duration-300 font-semibold text-lg px-3 py-2 relative group`}
              >
                Commander
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </motion.div>
            
            <motion.div whileHover={{ y: -2 }}>
              <Link
                href="/contact"
                className={`${textColor} hover:text-red-600 transition-all duration-300 font-semibold text-lg px-3 py-2 relative group`}
              >
                Contact
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </motion.div>
          </div>

          {/* Actions à droite */}
          <div className="flex items-center space-x-4 flex-1 justify-end">
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
            <motion.button
              onClick={onOpenCart}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`relative p-3 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300 ${textColor}`}
              aria-label="Panier"
            >
              <ShoppingCart className="w-6 h-6" />
              {itemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-gradient-to-r from-red-600 to-red-700 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold shadow-lg"
                >
                  {itemCount}
                </motion.span>
              )}
            </motion.button>

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="md:hidden p-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
            >
              <Menu className="w-7 h-7" />
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-24 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-2xl"
          >
            <nav className="flex flex-col p-6 space-y-3">
              <motion.div whileHover={{ x: 5 }}>
                <Link
                  href="/menu"
                  className={`flex items-center space-x-3 text-lg font-medium ${textColor} py-3 px-4 rounded-lg hover:bg-red-50 dark:hover:bg-gray-800 transition-all duration-200`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="text-2xl">📋</span>
                  <span>Menu</span>
                </Link>
              </motion.div>
              
              <motion.div whileHover={{ x: 5 }}>
                <Link
                  href="/a-propos"
                  className={`flex items-center space-x-3 text-lg font-medium ${textColor} py-3 px-4 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-800 transition-all duration-200`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="text-2xl">ℹ️</span>
                  <span>À propos</span>
                </Link>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/commander"
                  className="bg-gradient-to-r from-red-600 via-red-600 to-red-700 text-white px-6 py-4 rounded-xl font-bold text-lg text-center hover:from-red-700 hover:via-red-700 hover:to-red-800 transition-all duration-300 shadow-lg hover:shadow-xl transform"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="text-2xl mr-2">🍔</span>
                  Commander
                </Link>
              </motion.div>
              
              <motion.div whileHover={{ x: 5 }}>
                <Link
                  href="/contact"
                  className={`flex items-center space-x-3 text-lg font-medium ${textColor} py-3 px-4 rounded-lg hover:bg-green-50 dark:hover:bg-gray-800 transition-all duration-200`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="text-2xl">📧</span>
                  <span>Contact</span>
                </Link>
              </motion.div>
              
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    onOpenCart();
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center space-x-3 text-lg font-medium ${textColor} w-full py-3 px-4 rounded-lg hover:bg-yellow-50 dark:hover:bg-gray-800 transition-all duration-200`}
                >
                  <ShoppingCart className="w-6 h-6" />
                  <span>Panier</span>
                  {itemCount > 0 && (
                    <span className="ml-auto bg-red-600 text-white text-sm px-3 py-1 rounded-full font-bold">
                      {itemCount}
                    </span>
                  )}
                </motion.button>
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
          </motion.div>
        )}
      </div>
    </motion.header>
  );
}
