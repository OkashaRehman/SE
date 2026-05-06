import React from 'react';

export const LoadingSpinner = ({ size = 'md', message = '' }) => {
  const sizes = {
    sm: 'w-6 h-6 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className={`${sizes[size]} border-slate-300 dark:border-slate-600 border-t-primary-500 rounded-full animate-spin`} />
      {message && <p className="text-slate-600 dark:text-slate-400 font-semibold">{message}</p>}
    </div>
  );
};

export const FullPageLoader = ({ message = 'Loading...' }) => {
  return (
    <div className="fixed inset-0 bg-white dark:bg-slate-900 flex items-center justify-center z-50">
      <LoadingSpinner size="lg" message={message} />
    </div>
  );
};
