import Link from 'next/link';
import { useRouter } from 'next/router';
import { ShoppingCart, Menu, User, Shield, LogOut, Sun, Moon, X, ChevronDown } from 'lucide-react';
import { useHeaderColor } from '@/hooks/useHeaderColor';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [showProfileMenu, setShowProfileMenu] = useState(false);
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
    setShowProfileMenu(false);
  };

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-2xl border-b border-gray-200/20 dark:border-gray-700/20' 
          : 'bg-transparent'
      }`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo / Home Link */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
          <Link 
            href="/"
              className="flex items-center group"
          >
              <div className="relative">
            <Image
              src="/images/logo.png"
              alt="Le 9 Logo"
              width={60}
              height={60}
                  className="transition-all duration-300 group-hover:drop-shadow-lg"
              style={{ width: 'auto', height: 'auto' }}
            />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-full blur-xl"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </div>
          </Link>
          </motion.div>

          {/* Navigation - Desktop */}
          <nav className="hidden lg:flex items-center space-x-1">
            {menuItems.map((item, index) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              >
            <Link
                  href={item.href}
                  className={`relative px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 group ${
                    router.pathname === item.href
                      ? 'text-red-600 dark:text-red-400'
                      : isScrolled
                        ? 'text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400'
                        : 'text-white hover:text-red-200'
                  }`}
                >
                  <span className="relative z-10">{item.label}</span>
                  <motion.div
                    className={`absolute inset-0 rounded-lg ${
                      router.pathname === item.href
                        ? 'bg-red-100 dark:bg-red-900/30'
                        : 'bg-transparent group-hover:bg-white/10 dark:group-hover:bg-gray-800/50'
                    }`}
                    layoutId={`nav-${item.href}`}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  />
                </Link>
              </motion.div>
            ))}
            
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
            <Link
                href="/promos"
                className={`relative px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 group ${
                  router.pathname === '/promos'
                    ? 'text-red-600 dark:text-red-400'
                    : isScrolled
                      ? 'text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400'
                      : 'text-white hover:text-red-200'
                }`}
              >
                <span className="relative z-10">Promos</span>
                <motion.div
                  className={`absolute inset-0 rounded-lg ${
                    router.pathname === '/promos'
                      ? 'bg-red-100 dark:bg-red-900/30'
                      : 'bg-transparent group-hover:bg-white/10 dark:group-hover:bg-gray-800/50'
                  }`}
                  layoutId="nav-promos"
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                />
            </Link>
            </motion.div>
          </nav>

          {/* Bouton Commander au centre */}
          <motion.div 
            className="hidden lg:flex"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4, type: "spring", stiffness: 200 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href="/commander"
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 rounded-full blur-lg opacity-75 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-8 py-3 rounded-full font-bold text-lg shadow-2xl transition-all duration-300 group-hover:shadow-red-500/25">
                <span className="flex items-center space-x-2">
                  <motion.span
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  >
                    🍔
                  </motion.span>
                  <span>Commander</span>
                </span>
          </div>
            </Link>
          </motion.div>

          {/* Actions à droite */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Panier */}
            <motion.button
              onClick={onOpenCart}
              className={`relative p-3 rounded-full transition-all duration-300 group ${
                isScrolled
                  ? 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                  : 'bg-white/10 hover:bg-white/20'
              }`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ShoppingCart className={`w-5 h-5 transition-colors duration-300 ${
                isScrolled
                  ? 'text-gray-700 dark:text-gray-300 group-hover:text-red-600'
                  : 'text-white group-hover:text-red-200'
              }`} />
              {itemCount > 0 && (
                <motion.div
                  className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500 }}
                >
                  {itemCount}
                </motion.div>
              )}
            </motion.button>

            {/* Theme Toggle */}
            <motion.button
              onClick={toggleTheme}
              className={`p-3 rounded-full transition-all duration-300 group ${
                isScrolled
                  ? 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                  : 'bg-white/10 hover:bg-white/20'
              }`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {theme === 'dark' ? (
                <Sun className={`w-5 h-5 transition-colors duration-300 ${
                  isScrolled
                    ? 'text-gray-700 dark:text-gray-300 group-hover:text-yellow-500'
                    : 'text-white group-hover:text-yellow-200'
                }`} />
              ) : (
                <Moon className={`w-5 h-5 transition-colors duration-300 ${
                  isScrolled
                    ? 'text-gray-700 dark:text-gray-300 group-hover:text-blue-500'
                    : 'text-white group-hover:text-blue-200'
                }`} />
              )}
            </motion.button>

            {/* Profile Menu */}
            {isAuthenticated ? (
              <motion.div
                className="relative"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                <motion.button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className={`flex items-center space-x-2 p-3 rounded-full transition-all duration-300 group ${
                    isScrolled
                      ? 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                      : 'bg-white/10 hover:bg-white/20'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <User className={`w-5 h-5 transition-colors duration-300 ${
                    isScrolled
                      ? 'text-gray-700 dark:text-gray-300 group-hover:text-red-600'
                      : 'text-white group-hover:text-red-200'
                  }`} />
                  <span className={`font-medium text-sm transition-colors duration-300 ${
                    isScrolled
                      ? 'text-gray-700 dark:text-gray-300 group-hover:text-red-600'
                      : 'text-white group-hover:text-red-200'
                  }`}>
                    {user?.name || 'Profil'}
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-colors duration-300 ${
                    isScrolled
                      ? 'text-gray-700 dark:text-gray-300 group-hover:text-red-600'
                      : 'text-white group-hover:text-red-200'
                  }`} />
                </motion.button>

                <AnimatePresence>
                  {showProfileMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
                    >
                      <div className="py-2">
                        <Link
                          href="/profile"
                          className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          <User className="w-4 h-4 mr-3" />
                          Mon profil
                    </Link>
                      <Link
                        href="/admin"
                          className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          onClick={() => setShowProfileMenu(false)}
                      >
                          <Shield className="w-4 h-4 mr-3" />
                        Administration
                      </Link>
                    <button
                      onClick={handleLogout}
                          className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                          <LogOut className="w-4 h-4 mr-3" />
                          Se déconnecter
                    </button>
                  </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
              <Link
                href="/auth/login"
                    className={`px-6 py-3 rounded-full font-semibold text-sm transition-all duration-300 ${
                      isScrolled
                        ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl'
                        : 'bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm'
                    }`}
                  >
                    Se connecter
              </Link>
                </motion.div>
              </motion.div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`lg:hidden p-3 rounded-full transition-all duration-300 ${
              isScrolled
                ? 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                : 'bg-white/10 hover:bg-white/20'
            }`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <AnimatePresence mode="wait">
            {isMobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className={`w-6 h-6 ${
                    isScrolled
                      ? 'text-gray-700 dark:text-gray-300'
                      : 'text-white'
                  }`} />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className={`w-6 h-6 ${
                    isScrolled
                      ? 'text-gray-700 dark:text-gray-300'
                      : 'text-white'
                  }`} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden overflow-hidden"
            >
              <div className={`py-6 space-y-4 ${
                    isScrolled
                  ? 'bg-white dark:bg-gray-900' 
                  : 'bg-white/95 backdrop-blur-md'
              }`}>
                {/* Bouton Commander en mobile */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  <Link
                    href="/commander"
                    className="block bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-4 rounded-2xl font-bold text-lg text-center shadow-2xl hover:shadow-red-500/25 transform hover:scale-105 transition-all duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="flex items-center justify-center space-x-2">
                      <motion.span
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                      >
                        🍔
                      </motion.span>
                      <span>Commander</span>
                    </span>
                  </Link>
                </motion.div>
                
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
                  {menuItems.map((item, index) => (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                    >
                      <Link
                        href={item.href}
                        className={`flex items-center space-x-3 text-lg font-medium px-4 py-3 rounded-xl transition-all duration-300 ${
                          router.pathname === item.href
                            ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                            : isScrolled
                              ? 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-red-600'
                              : 'text-gray-900 hover:bg-gray-100 hover:text-red-600'
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <div className="w-2 h-2 bg-red-500 rounded-full" />
                        <span>{item.label}</span>
                      </Link>
                    </motion.div>
                  ))}
                  
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.5 }}
                  >
                    <Link
                      href="/promos"
                      className={`flex items-center space-x-3 text-lg font-medium px-4 py-3 rounded-xl transition-all duration-300 ${
                        router.pathname === '/promos'
                          ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                          : isScrolled
                            ? 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-red-600'
                            : 'text-gray-900 hover:bg-gray-100 hover:text-red-600'
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="w-2 h-2 bg-orange-500 rounded-full" />
                      <span>Promos</span>
                    </Link>
                  </motion.div>
                </div>

                {/* Actions mobile */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
                  <motion.button
                    onClick={() => {
                      onOpenCart();
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex items-center space-x-3 text-lg font-medium px-4 py-3 rounded-xl transition-all duration-300 w-full ${
                      isScrolled
                        ? 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-red-600'
                        : 'text-gray-900 hover:bg-gray-100 hover:text-red-600'
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.6 }}
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>Panier</span>
                    {itemCount > 0 && (
                      <motion.span
                        className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500 }}
                      >
                        {itemCount}
                      </motion.span>
                    )}
                  </motion.button>

                  {isAuthenticated ? (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.7 }}
                      className="space-y-2"
                    >
                <Link
                        href="/profile"
                        className={`flex items-center space-x-3 text-lg font-medium px-4 py-3 rounded-xl transition-all duration-300 ${
                    isScrolled
                            ? 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-red-600'
                            : 'text-gray-900 hover:bg-gray-100 hover:text-red-600'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <User className="w-5 h-5" />
                        <span>Mon profil</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 text-lg font-medium px-4 py-3 rounded-xl transition-all duration-300 w-full text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <LogOut className="w-5 h-5" />
                        <span>Se déconnecter</span>
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.7 }}
                    >
                      <Link
                        href="/auth/login"
                        className="block bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold text-center transition-all duration-300"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Se connecter
                </Link>
                    </motion.div>
              )}
                </div>
          </div>
            </motion.div>
        )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}