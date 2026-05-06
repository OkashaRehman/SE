import React from 'react';

export const Badge = ({ children, variant = 'primary', size = 'md', className = '' }) => {
  const baseStyles = 'inline-flex items-center gap-1 rounded-full font-semibold';

  const variants = {
    primary: 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-200',
    secondary: 'bg-secondary-100 dark:bg-secondary-900 text-secondary-700 dark:text-secondary-200',
    danger: 'bg-medical-100 dark:bg-medical-900 text-medical-700 dark:text-medical-200',
    warning: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-200',
    success: 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200',
    neutral: 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200',
  };

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </span>
  );
};
