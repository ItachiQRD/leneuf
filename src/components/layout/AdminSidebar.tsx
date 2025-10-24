import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  LayoutDashboard, 
  Pizza, 
  UtensilsCrossed, 
  Droplet, 
  Beer, 
  IceCream, 
  Users, 
  Settings,
  ChevronDown,
  Receipt,
  BarChart3,
  BarChart,
  Gift
} from 'lucide-react';

const menuItems = [
  {
    title: 'Tableau de bord',
    icon: LayoutDashboard,
    path: '/admin',
  },
  {
    title: 'Produits',
    icon: Pizza,
    children: [
      { title: 'Plats', path: '/admin/foods' },
      { title: 'Accompagnements', path: '/admin/sides' },
      { title: 'Sauces', path: '/admin/sauces' },
      { title: 'Boissons', path: '/admin/drinks' },
      { title: 'Desserts', path: '/admin/desserts' },
      { title: 'Ingrédients', path: '/admin/ingredients' },
    ],
  },
  {
    title: 'Commandes',
    icon: Receipt,
    path: '/admin/orders',
  },
  {
    title: 'Promotions',
    icon: Gift,
    path: '/admin/promotions',
  },
  {
    title: 'Utilisateurs',
    icon: Users,
    path: '/admin/users',
  },
  {
    title: 'Statistiques',
    icon: BarChart3,
    children: [
      { title: 'Analytics', path: '/admin/analytics' },
      { title: 'Ventes', path: '/admin/stats/sales' },
      { title: 'Produits', path: '/admin/stats/products' },
      { title: 'Clients', path: '/admin/stats/customers' },
    ],
  },
  {
    title: 'Paramètres',
    icon: Settings,
    path: '/admin/settings',
  },
];

export default function AdminSidebar() {
  const router = useRouter();
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  const toggleMenu = (title: string) => {
    setExpandedMenus(prev => 
      prev.includes(title) 
        ? prev.filter(item => item !== title)
        : [...prev, title]
    );
  };

  const isActive = (path: string) => router.pathname === path;
  const isMenuActive = (item: any) => {
    if (item.path) return isActive(item.path);
    if (item.children) {
      return item.children.some((child: any) => isActive(child.path));
    }
    return false;
  };

  return (
    <div className="w-64 bg-neutral-900 text-gray-300 h-full overflow-y-auto transition-all duration-300 ease-in-out">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <span className="text-xl font-bold text-white">
            FAST<span className="text-primary-400">FOOD</span>
          </span>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isExpanded = expandedMenus.includes(item.title);
            const isItemActive = isMenuActive(item);

            return (
              <div key={item.title}>
                {item.children ? (
                  // Menu avec sous-éléments
                  <>
                    <button
                      onClick={() => toggleMenu(item.title)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                        isItemActive 
                          ? 'bg-primary-400/10 text-primary-400' 
                          : 'hover:bg-neutral-800'
                      }`}
                    >
                      <div className="flex items-center">
                        <Icon className="w-5 h-5 mr-3" />
                        <span>{item.title}</span>
                      </div>
                      <ChevronDown 
                        className={`w-4 h-4 transition-transform ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {isExpanded && (
                      <div className="mt-1 ml-4 pl-4 border-l border-neutral-800 space-y-1">
                        {item.children.map((child) => (
                          <Link
                            key={child.path}
                            href={child.path}
                            className={`block px-3 py-2 rounded-lg transition-colors ${
                              isActive(child.path)
                                ? 'bg-primary-400/10 text-primary-400'
                                : 'hover:bg-neutral-800'
                            }`}
                          >
                            {child.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  // Lien simple
                  <Link
                    href={item.path}
                    className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                      isActive(item.path)
                        ? 'bg-primary-400/10 text-primary-400'
                        : 'hover:bg-neutral-800'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    <span>{item.title}</span>
                  </Link>
                )}
              </div>
            );
          })}
        </nav>
      </div>

    </div>
  );
}