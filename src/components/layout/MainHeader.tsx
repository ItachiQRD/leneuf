import Link from 'next/link';
import { useRouter } from 'next/router';
import { ShoppingCart, Menu, User, Shield, LogOut, Sun, Moon } from 'lucide-react';
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
  const [isProfileHovered, setIsProfileHovered] = useState(false);
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
      <div className="w-full mx-auto relative">
        <div className="flex items-center justify-between h-24 px-8">
          {/* Dark mode - Gauche */}
          <motion.button
            onClick={toggleTheme}
            whileHover={{ scale: 1.1, rotate: 180 }}
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
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/">
                <Image
                  src="/images/logo.png"
                  alt="Le 9 Logo"
                  width={40}
                  height={40}
                  className="drop-shadow-lg"
                  style={{ width: 'auto', height: 'auto' }}
                />
              </Link>
            </motion.div>
          </div>

          {/* Centrage des liens de navigation */}
          <div className="hidden md:flex items-center justify-end flex-1 space-x-8 pr-44">
            {/* À propos */}
            <motion.div whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
              <Link
                href="/a-propos"
                className={`${textColor} hover:text-red-600 transition-all duration-300 font-bold text-sm uppercase tracking-wider relative group px-3 py-2`}
              >
                À PROPOS
                <motion.span
                  className="absolute -bottom-1 left-3 right-3 h-0.5 bg-gradient-to-r from-red-600 to-orange-500"
                  initial={{ width: 0 }}
                  whileHover={{ width: 'calc(100% - 1.5rem)' }}
                  transition={{ duration: 0.3 }}
                />
              </Link>
            </motion.div>

            {/* Menu */}
            <motion.div
              whileHover={{ scale: 1.1, x: -5 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <Link
                href="/menu"
                className="block px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-bold text-sm uppercase tracking-wider shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-red-500 hover:border-red-400 relative overflow-hidden group"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />
                MENU
              </Link>
            </motion.div>
          </div>

          {/* Logo centré (Desktop) */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center z-10">
            <motion.div
              whileHover={{ scale: 1.15, rotate: [0, -5, 5, -5, 0] }}
              whileTap={{ scale: 0.95 }}
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                y: {
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
            >
              <Link href="/" className="relative">
                {/* Effet de halo pulsant */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 rounded-full blur-2xl opacity-30"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.2, 0.4, 0.2],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                
                <div className="relative">
                  <Image
                    src="/images/logo.png"
                    alt="Le 9 Logo"
                    width={140}
                    height={140}
                    className="drop-shadow-2xl filter brightness-105"
                    style={{ width: 'auto', height: 'auto' }}
                  />
                </div>
              </Link>
            </motion.div>
          </div>

          {/* Partie droite : Commander, Contact, Auth, Cart */}
          <div className="hidden md:flex items-center justify-start flex-1 space-x-8 pl-44">
            {/* Commander */}
            <motion.div
              whileHover={{ scale: 1.1, x: 5 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <Link
                href="/commander"
                className="block px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-bold text-sm uppercase tracking-wider shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-red-500 hover:border-red-400 relative overflow-hidden group"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />
                COMMANDER
              </Link>
            </motion.div>

            {/* Contact */}
            <motion.div whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
              <Link
                href="/contact"
                className={`${textColor} hover:text-red-600 transition-all duration-300 font-bold text-sm uppercase tracking-wider relative group px-3 py-2`}
              >
                CONTACT
                <motion.span
                  className="absolute -bottom-1 left-3 right-3 h-0.5 bg-gradient-to-r from-red-600 to-orange-500"
                  initial={{ width: 0 }}
                  whileHover={{ width: 'calc(100% - 1.5rem)' }}
                  transition={{ duration: 0.3 }}
                />
              </Link>
            </motion.div>
          </div>

          {/* Partie droite : Auth, Cart, Mobile menu */}
          <div className="flex items-center space-x-4">

            {/* Auth */}
            <div className="hidden md:block">
              {isAuthenticated ? (
                <motion.div 
                  initial={{ scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative group"
                  onHoverStart={() => setIsProfileHovered(true)}
                  onHoverEnd={() => setIsProfileHovered(false)}
                >
                  <button 
                    className={`flex items-center space-x-2 p-3 rounded-full hover:bg-gray-100/10 dark:hover:bg-gray-800/50 transition-all duration-300 ${textColor}`}
                  >
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 0.3 }}
                    >
                      <User className="w-5 h-5" />
                    </motion.div>
                    <span className={`${textColor} text-sm font-medium`}>
                      {user?.name || 'Profil'}
                    </span>
                  </button>
                  
                  {/* Dropdown - visible au survol du parent */}
                  <AnimatePresence>
                    {isProfileHovered && (
                      <motion.div
                        initial={{ opacity: 0, y: -15, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -15, scale: 0.9 }}
                        transition={{ 
                          duration: 0.3,
                          ease: "easeOut",
                          staggerChildren: 0.05
                        }}
                        className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-2xl py-2 border border-gray-200 dark:border-gray-700 origin-top-right"
                      >
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-orange-500/5 rounded-xl pointer-events-none"
                        />
                        
                        <div className="relative z-10">
                          <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                          >
                            <Link
                              href="/profile"
                              className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gradient-to-r hover:from-red-50 hover:to-orange-50 dark:hover:from-red-900/20 dark:hover:to-orange-900/20 transition-all duration-200 group"
                            >
                              <motion.div 
                                initial={{ scale: 1 }}
                                whileHover={{ scale: 1.2, rotate: 5 }}
                                transition={{ type: "spring", stiffness: 300 }}
                              >
                                <User className="w-4 h-4 mr-3 text-gray-600 dark:text-gray-400 group-hover:text-red-600" />
                              </motion.div>
                              <span className="group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">Mon Profil</span>
                            </Link>
                          </motion.div>
                          
                          {user?.isAdmin && (
                            <motion.div
                              initial={{ x: -20, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: 0.15 }}
                            >
                              <Link
                                href="/admin"
                                className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gradient-to-r hover:from-red-50 hover:to-orange-50 dark:hover:from-red-900/20 dark:hover:to-orange-900/20 transition-all duration-200 group"
                              >
                                <motion.div 
                                  initial={{ scale: 1 }}
                                  whileHover={{ scale: 1.2, rotate: 5 }}
                                  transition={{ type: "spring", stiffness: 300 }}
                                >
                                  <Shield className="w-4 h-4 mr-3 text-gray-600 dark:text-gray-400 group-hover:text-red-600" />
                                </motion.div>
                                <span className="group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">Administration</span>
                              </Link>
                            </motion.div>
                          )}
                          
                          <div className="border-t border-gray-200 dark:border-gray-700 my-1" />
                          
                          <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                          >
                            <button
                              onClick={handleLogout}
                              className="w-full flex items-center px-4 py-3 text-sm font-medium text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-orange-50 dark:hover:from-red-900/20 dark:hover:to-orange-900/20 transition-all duration-200 group"
                            >
                              <motion.div 
                                initial={{ scale: 1 }}
                                whileHover={{ scale: 1.2, rotate: -5 }}
                                transition={{ type: "spring", stiffness: 300 }}
                              >
                                <LogOut className="w-4 h-4 mr-3 group-hover:text-red-700" />
                              </motion.div>
                              <span className="group-hover:text-red-700 transition-colors">Déconnexion</span>
                            </button>
                          </motion.div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href="/auth/login"
                    className={`flex items-center space-x-2 p-3 rounded-full hover:bg-gray-100/10 dark:hover:bg-gray-800/50 transition-all duration-300 ${textColor}`}
                  >
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 0.3 }}
                    >
                      <User className="w-5 h-5" />
                    </motion.div>
                    <span className={`${textColor} text-sm font-medium`}>
                      Connexion
                    </span>
                  </Link>
                </motion.div>
              )}
            </div>

            {/* Cart Button avec animation */}
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
          <div className="md:hidden absolute top-24 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-lg">
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
