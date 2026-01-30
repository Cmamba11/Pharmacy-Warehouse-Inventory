
import React from 'react';
import { NAVIGATION_ITEMS } from '../constants';

interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  userProfile: {
    fullName: string;
    role: string;
  };
}

const Sidebar: React.FC<SidebarProps> = ({ currentPath, onNavigate, userProfile }) => {
  return (
    <div className="w-64 bg-slate-900 h-screen fixed left-0 top-0 text-slate-300 flex flex-col z-20 shadow-xl">
      <div className="p-6 flex items-center space-x-3">
        <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">
          P
        </div>
        <div className="leading-tight">
          <h1 className="text-white font-bold tracking-tight">PharmaStock</h1>
          <p className="text-[10px] uppercase tracking-widest text-slate-500">Intelligence v1.0</p>
        </div>
      </div>

      <nav className="flex-1 mt-6 px-4 space-y-1">
        {NAVIGATION_ITEMS.map((item) => {
          const isActive = currentPath === item.path;
          return (
            <button
              key={item.path}
              onClick={() => onNavigate(item.path)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-emerald-500/10 text-emerald-400 font-medium' 
                  : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span className={isActive ? 'text-emerald-400' : 'text-slate-500'}>
                {item.icon}
              </span>
              <span>{item.name}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-6 border-t border-slate-800">
        <div className="flex items-center space-x-3">
          <img src="https://picsum.photos/32/32?seed=user" className="w-8 h-8 rounded-full border border-slate-700" alt="User" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{userProfile.fullName}</p>
            <p className="text-xs text-slate-500 truncate">{userProfile.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
