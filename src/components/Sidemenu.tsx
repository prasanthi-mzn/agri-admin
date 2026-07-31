   import { 
  LayoutDashboard, 
  Boxes, 
  Users, 
  ShoppingCart, 
  CreditCard,
  MessageSquareText,
  PackageSearch,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import type { CSSProperties } from 'react';
import Logo from '../assets/logo2.png'

export const SideMenu = () => {
  const location = useLocation();

    const menuItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Inventory Management', path: '/inventory', icon: <Boxes size={20} /> },
    { name: 'Users Management', path: '/dealers', icon: <Users size={20} /> },
    { name: 'Orders', path: '/orders', icon: <ShoppingCart size={20} /> },
    { name: 'Credit Book', path: '/payments', icon: <CreditCard size={20} /> },
    { name: 'Users Feedback', path: '/users-feedbacks', icon: <MessageSquareText size={20} /> },
    { name: 'Requested Product', path: '/reported-errors', icon: <PackageSearch size={20} /> },
    // { name: 'Dealer App Settings', path: '/dealer-app-settings', icon: <Settings size={20} /> },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const getMenuItemClass = (path: string) => {
    const baseClass = "flex items-center justify-start px-4 py-3 rounded-lg transition-colors font-medium text-left menu-item";
    const isMenuActive = isActive(path);
    
    if (isMenuActive) {
      return `${baseClass} menu-item-active bg-common-btn-bg text-white`;
    }
    
    return `${baseClass} menu-item-hover`;
  };

  const getMenuItemStyle = (path: string): CSSProperties | undefined => {
    if (!isActive(path)) return undefined;

    return {
      backgroundColor: 'var(--common-btn-bg)',
      color: '#fff',
    };
  };
  
  return(
      <aside className="sidemenu-container">
          <img src={Logo} className="sidemenu-logo" />
        <nav className="sidemenu-nav">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={getMenuItemClass(item.path)}
              style={getMenuItemStyle(item.path)}
            >
              <span className="menu-item-content">
                <span className="menu-item-icon">{item.icon}</span>
                <span className="menu-item-text">{item.name}</span>
              </span>
            </Link>
          ))}
        </nav>
      </aside>
 )
   }
