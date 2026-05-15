   import { 
  LayoutDashboard, 
  Boxes, 
  Users, 
  ShoppingCart, 
  CreditCard,
  Settings,  
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import Logo from '../assets/logo2.png'

export const SideMenu = () => {
  const location = useLocation();
  const { theme } = useTheme();

    const menuItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Inventory Management', path: '/inventory', icon: <Boxes size={20} /> },
    { name: 'Dealer Management', path: '/dealers', icon: <Users size={20} /> },
    { name: 'Orders', path: '/orders', icon: <ShoppingCart size={20} /> },
    { name: 'Payment Processing', path: '/payments', icon: <CreditCard size={20} /> },
    { name: 'Dealer App Settings', path: '/dealer-app-settings', icon: <Settings size={20} /> },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const getMenuItemClass = (path: string) => {
    const baseClass = "flex items-center justify-start px-4 py-3 rounded-lg transition-colors font-medium text-left";
    const isMenuActive = isActive(path);
    
    if (isMenuActive) {
      return `${baseClass} menu-item-active`;
    }
    
    return `${baseClass} menu-item-hover`;
  };
  
  return(
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
          <img src={Logo} />
        <nav className="flex-1 px-4 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={getMenuItemClass(item.path)}
            >
              <span className="flex items-center justify-start gap-3 w-full">
                {item.icon}
                <span>{item.name}</span>
              </span>
            </Link>
          ))}
        </nav>
      </aside>
 )
   }