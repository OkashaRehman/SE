import React from 'react';
import { Menu, X, Bell, Settings } from 'lucide-react';

export const Header = ({ title, subtitle, onMenuToggle, showMenu = true, actions = [] }) => {
  return (
    <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-30">
      <div className="flex items-center justify-between p-6 max-w-full">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{title}</h1>
          {subtitle && (
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{subtitle}</p>
          )}
        </div>

        <div className="flex items-center gap-4 ml-6">
          {actions.map((action, idx) => (
            <button
              key={idx}
              onClick={action.onClick}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors text-slate-700 dark:text-slate-300"
              title={action.label}
            >
              <action.icon className="w-5 h-5" />
            </button>
          ))}
          
          {showMenu && (
            <button
              onClick={onMenuToggle}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors md:hidden text-slate-700 dark:text-slate-300"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
