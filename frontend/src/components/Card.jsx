import React from 'react';

export const Card = ({
  children,
  className = '',
  hover = false,
  ...props
}) => {
  return (
    <div
      className={`
        bg-white dark:bg-slate-800
        rounded-xl
        shadow-card
        border border-slate-200 dark:border-slate-700
        p-6
        ${hover ? 'hover:shadow-lg transition-shadow cursor-pointer' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ title, subtitle, icon: Icon, className = '' }) => (
  <div className={`flex items-start gap-4 mb-6 ${className}`}>
    {Icon && (
      <div className="flex-shrink-0 w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
        <Icon className="w-6 h-6 text-primary-600" />
      </div>
    )}
    <div className="flex-1">
      <h3 className="text-xl font-display font-semibold text-slate-900 dark:text-white">
        {title}
      </h3>
      {subtitle && (
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          {subtitle}
        </p>
      )}
    </div>
  </div>
);

export const CardBody = ({ children, className = '' }) => (
  <div className={`space-y-4 ${className}`}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = '', align = 'right' }) => (
  <div className={`flex justify-${align} gap-3 mt-6 pt-6 border-t border-slate-200 dark:border-slate-700 ${className}`}>
    {children}
  </div>
);
