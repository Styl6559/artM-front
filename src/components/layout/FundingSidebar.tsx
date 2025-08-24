import React from 'react';
import { NavLink } from 'react-router-dom';
import { Briefcase, DollarSign, Building2, Rocket, User, Award } from 'lucide-react';

export const fundingNav = [
  { label: 'Venture Capital', path: '/funding/vc', icon: Building2 },
  { label: 'Micro VCs', path: '/funding/microvc', icon: DollarSign },
  { label: 'Incubators', path: '/funding/incubator', icon: Briefcase },
  { label: 'Accelerators', path: '/funding/accelerator', icon: Rocket },
  { label: 'Angel Investors', path: '/funding/angel', icon: User },
  { label: 'Government Grants', path: '/funding/grants', icon: Award },
];

export const FundingMobileNav: React.FC = () => (
  <div className="md:hidden w-full flex gap-2 px-4 mt-6 overflow-x-auto pb-3">
    {fundingNav.map(item => {
      const Icon = item.icon;
      return (
        <NavLink
          key={item.label}
          to={item.path}
          className={({ isActive }) =>
            `flex flex-col items-center min-w-[90px] px-3 py-3 rounded-xl border transition-all duration-200
            ${isActive 
              ? 'bg-blue-600/20 border-blue-500/50 text-blue-400 shadow-lg' 
              : 'bg-gray-800/80 border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-500 hover:text-white'
            }`
          }
          style={{ textDecoration: 'none' }}
        >
          <Icon className="w-4 h-4 mb-1" />
          <span className="text-xs font-medium text-center leading-tight">{item.label.split(' ')[0]}</span>
        </NavLink>
      );
    })}
  </div>
);

const FundingSidebar: React.FC = () => {
  // Only render on desktop
  return (
    <aside className="hidden md:block w-full md:fixed md:top-24 md:left-0 md:w-64 md:h-[calc(100vh-6rem)] bg-gray-900/95 backdrop-blur-sm border-r border-gray-700/50 shadow-xl md:z-30 flex flex-col">
      <div className="p-6 border-b border-gray-700/50">
        <h3 className="text-lg font-semibold text-white mb-1">Funding Options</h3>
        <p className="text-sm text-gray-400">Explore different sources</p>
      </div>
      
      <nav className="flex-1 flex flex-col gap-1 p-4">
        {fundingNav.map(item => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 relative
                ${isActive 
                  ? 'bg-blue-600/20 text-blue-400 shadow-lg border border-blue-500/30' 
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white border border-transparent hover:border-gray-600'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors
                    ${isActive ? 'bg-blue-500/20' : 'bg-gray-700 group-hover:bg-gray-600'}
                  `}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium">{item.label}</span>
                  {isActive && (
                    <div className="absolute right-3 w-2 h-2 bg-blue-400 rounded-full"></div>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default FundingSidebar; 