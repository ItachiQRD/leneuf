import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  Bell, 
  Search, 
  User,
  LogOut,
  Settings,
  Menu as MenuIcon,
  X
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminHeader() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const router = useRouter();
  const { user, logout } = useAuth();

  return (
    <header className="bg-[#1e2632] border-b border-gray-700 fixed top-0 right-0 left-0 z-50 h-16">
      <div className="h-full px-4 flex items-center justify-between">
        {/* Gauche */}
        <div className="flex items-center gap-4">
          <button className="lg:hidden p-2 hover:bg-gray-700/50 rounded-lg text-white">
            <MenuIcon className="w-6 h-6" />
          </button>
          <div className="text-lg font-semibold text-white">Administration</div>
        </div>

        {/* Droite */}
        <div className="flex items-center space-x-4">
          {/* Recherche */}
          <button 
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-2 hover:bg-gray-700/50 rounded-lg text-white"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Notifications */}
          <div className="relative">
            <button 
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="p-2 hover:bg-gray-700/50 rounded-lg text-white"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>

          {/* Profil */}
          <div className="relative">
            <button 
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 p-2 hover:bg-gray-700/50 rounded-lg text-white"
            >
              <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-gray-300" />
              </div>
              <span className="hidden md:block font-medium">
                {user?.name || 'Admin'}
              </span>
            </button>

            {/* Menu profil */}
            {profileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-[#1e2632] rounded-lg shadow-lg py-1 border border-gray-700">
                <Link
                  href="/admin/settings"
                  className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700/50"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Paramètres
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-red-900/20"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Déconnexion
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Barre de recherche */}
      {searchOpen && (
        <div className="absolute top-16 inset-x-0 bg-[#1e2632] border-b border-gray-700 p-4">
          <div className="max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher..."
                className="w-full pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-white placeholder-gray-400"
              />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}