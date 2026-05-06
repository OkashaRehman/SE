import React, { forwardRef } from 'react';

export const Input = forwardRef(({
  label,
  error,
  helpText,
  icon: Icon,
  type = 'text',
  fullWidth = true,
  className = '',
  ...props
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
          {label}
          {props.required && <span className="text-medical-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <input
          ref={ref}
          type={type}
          className={`
            w-full
            px-4 py-3
            ${Icon ? 'pl-11' : ''}
            border-2 border-slate-300 dark:border-slate-600
            rounded-lg
            bg-white dark:bg-slate-700
            text-slate-900 dark:text-white
            placeholder-slate-500 dark:placeholder-slate-400
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
            focus:ring-offset-0
            transition-all duration-200
            disabled:bg-slate-100 dark:disabled:bg-slate-800
            disabled:cursor-not-allowed
            ${error ? 'border-medical-500 focus:ring-medical-500' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="text-sm text-medical-500 mt-2 font-semibold">
          {error}
        </p>
      )}
      {helpText && !error && (
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
          {helpText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
