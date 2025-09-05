import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import {
  LayoutDashboard,
  ChefHat,
  UtensilsCrossed,
  Droplet,
  Beer,
  IceCream,
  Users,
  Settings,
  Menu as MenuIcon,
  X,
  ChevronDown,
  Bell,
  ShoppingBag,
  BarChart,
  Package,
  Moon,
  Sun,
  LogOut
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, loading, logout } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push('/auth/login');
        return;
      }

      if (user && !user.isAdmin) {
        router.push('/');
        return;
      }
    }
  }, [loading, isAuthenticated, user, router]);

  const menuItems = [
    {
      title: "PRINCIPAL",
      items: [
        { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/admin/orders', label: 'Commandes', icon: ShoppingBag },
        { href: '/admin/analytics', label: 'Analytiques', icon: BarChart },
      ]
    },
    {
      title: "GESTION DES PRODUITS",
      items: [
        { href: '/admin/foods', label: 'Plats', icon: ChefHat },
        { href: '/admin/sides', label: 'Accompagnements', icon: UtensilsCrossed },
        { href: '/admin/drinks', label: 'Boissons', icon: Beer },
        { href: '/admin/desserts', label: 'Desserts', icon: IceCream },
        { href: '/admin/sauces', label: 'Sauces', icon: Droplet },
        { href: '/admin/ingredients', label: 'Ingrédients', icon: Package },
      ]
    },
    {
      title: "ADMINISTRATION",
      items: [
        { href: '/admin/users', label: 'Utilisateurs', icon: Users },
        { href: '/admin/settings', label: 'Paramètres', icon: Settings },
      ]
    }
  ];

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="w-64 h-full bg-[#1e2632] text-white">
        <div className="h-full flex flex-col">
          <div className="h-16 flex items-center px-4 border-b border-gray-700">
            <Link href="/" className="font-bold text-xl">Le9 Admin</Link>
          </div>

          <nav className="flex-1 overflow-y-auto">
            {menuItems.map((section, index) => (
              <div key={index} className="py-4">
                <h2 className="px-4 text-xs font-semibold text-gray-400 mb-2">{section.title}</h2>
                <div className="space-y-1">
                  {section.items.map((item, itemIndex) => {
                    const Icon = item.icon;
                    const isActive = router.pathname === item.href;
                    return (
                      <Link
                        key={itemIndex}
                        href={item.href}
                        className={`flex items-center px-4 py-2 text-sm transition-colors ${
                          isActive
                            ? 'bg-gray-800 text-white'
                            : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                        }`}
                      >
                        <Icon className="w-5 h-5 mr-3" />
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          <div className="p-4 border-t border-gray-700">
            <div className="flex items-center justify-between">
            <button
                onClick={toggleTheme}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>
              <button 
                onClick={logout}
                className="flex items-center space-x-2 text-red-400 hover:text-red-300 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Déconnexion</span>
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
