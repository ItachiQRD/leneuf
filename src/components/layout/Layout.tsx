import { motion, AnimatePresence } from 'framer-motion';
import Header from './MainHeader';
import Footer from './MainFooter';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <AnimatePresence mode="wait">
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="container mx-auto px-4 py-8 sm:px-6 lg:px-8"
        >
          {children}
        </motion.main>
      </AnimatePresence>
      <Footer />
    </div>
  );
};

export default Layout;