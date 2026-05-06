import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, LogOut } from 'lucide-react';

export const Sidebar = ({ items, user, onLogout, open = true }) => {
  const location = useLocation();

  return (
    <div className={`fixed left-0 top-0 h-screen bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 flex flex-col transition-all duration-300 ${open ? 'w-64' : 'w-20'} z-40`}>
      {/* Header */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">SC</span>
          </div>
          {open && (
            <div>
              <h1 className="text-lg font-bold text-slate-900 dark:text-white">SmartClinic</h1>
              <p className="text-xs text-slate-500">Healthcare System</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {items.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 font-semibold'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title={!open ? item.label : undefined}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {open && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      {user && (
        <div className="p-4 border-t border-slate-200 dark:border-slate-700 space-y-3">
          {open && (
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{user.name}</p>
              <p className="text-xs text-slate-500 capitalize">{user.role}</p>
            </div>
          )}
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-medical-100 dark:bg-medical-900 text-medical-600 dark:text-medical-400 rounded-lg hover:bg-medical-200 dark:hover:bg-medical-800 transition-colors font-semibold text-sm"
          >
            <LogOut className="w-4 h-4" />
            {open && 'Logout'}
          </button>
        </div>
      )}
    </div>
  );
};
