import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home,
  Building2,
  Rocket,
  DollarSign
} from 'lucide-react';
import Logo from '../ui/Logo';
import { useUi } from '../../contexts/UiContext';

const Sidebar: React.FC = () => {
  const { toggleConfirmDialog } = useUi();

  const navItems = [
    { icon: <Building2 size={22} className="min-w-[22px]" />, label: 'Incubators', path: '/incubators' },
    { icon: <Rocket size={22} className="min-w-[22px]" />, label: 'Accelerators', path: '/accelerators' },
    { icon: <DollarSign size={22} className="min-w-[22px]" />, label: 'Micro-VCs', path: '/microvcs' },
  ];

  const handleExit = () => {
    toggleConfirmDialog({
      title: 'Exit to Home Page?',
      message: 'You\'ll leave your current page. Are you sure you want to go to the home page?',
      confirmText: 'Yes, Go Home',
      cancelText: 'Stay Here',
      onConfirm: () => {
        window.location.href = '/';
      }
    });
  };

  return (
    <aside className="fixed top-16 left-0 w-64 h-[calc(100vh-4rem)] bg-gradient-to-b from-gray-50 via-white to-gray-100 border-r border-gray-200 shadow-sm z-30 flex flex-col">
      {/* Top: Logo and App Name */}
      <div className="flex items-center gap-3 px-6 pt-1">
        <Logo className="py-4" imgClassName="h-10 md:h-12 w-auto" />
      </div>

      {/* Nav Items */}
      <nav className="flex-1 flex flex-col gap-1 px-2 mt-4">
        {navItems.map(item => (
          <NavLink
            key={item.label}
            to={item.path}
            className={({ isActive }) =>
              `group flex items-center gap-4 px-4 py-2 rounded-lg font-medium text-gray-700 transition-all duration-150
              ${isActive ? 'bg-blue-50 border-l-4 border-blue-600 text-blue-700 shadow-sm' : 'border-l-4 border-transparent hover:bg-gray-100 hover:border-blue-200 hover:text-blue-700'}
              `
            }
          >
            {item.icon}
            <span className="text-base font-medium tracking-tight">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Exit Button at Bottom */}
      <div className="p-4 border-t border-gray-100 mt-auto">
        <button
          onClick={handleExit}
          className="w-full flex items-center gap-4 px-4 py-2 rounded-lg font-medium text-gray-600 hover:bg-gray-100 hover:text-blue-700 transition-all duration-150"
        >
          <Home size={22} className="min-w-[22px]" />
          <span className="text-base font-medium tracking-tight">Exit</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;