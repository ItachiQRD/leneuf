import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { User, LogOut, Settings, Receipt, Heart, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { AuthUser } from '@/types/auth';

interface UserMenuProps {
  user: AuthUser; 
}

export default function UserMenu({ user }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { logout } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]); 

  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
    router.push('/auth/login');
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-gray-700 hover:text-orange-500 focus:outline-none"
      >
        <User className="h-6 w-6" />
        <span className="hidden md:block">{user.name}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 py-2 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
          <Link
            href="/profile"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50"
            onClick={() => setIsOpen(false)}
          >
            <div className="flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span>Mon Profil</span>
            </div>
          </Link>

          <Link
            href="/orders"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50"
            onClick={() => setIsOpen(false)}
          >
            <div className="flex items-center space-x-2">
              <Receipt className="w-4 h-4" />
              <span>Mes Commandes</span>
            </div>
          </Link>

          <Link
            href="/favorites"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50"
            onClick={() => setIsOpen(false)}
          >
            <div className="flex items-center space-x-2">
              <Heart className="w-4 h-4" />
              <span>Favoris</span>
            </div>
          </Link>

          {user.isAdmin && (
            <Link
              href="/admin"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50"
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-center space-x-2">
                <LayoutDashboard className="w-4 h-4" />
                <span>Administration</span>
              </div>
            </Link>
          )}

          <hr className="my-2" />

          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-50"
          >
            <div className="flex items-center space-x-2">
              <LogOut className="w-4 h-4" />
              <span>Déconnexion</span>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}