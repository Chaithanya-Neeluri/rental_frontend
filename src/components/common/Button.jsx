import React from 'react';
import clsx from 'clsx';

// Reusable button component for consistent CTAs
const baseClasses =
  'inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:opacity-60 disabled:cursor-not-allowed';

const variants = {
  primary:
    'bg-gradient-to-r from-brand-500 via-accent-500 to-brand-600 text-white shadow-glass hover:shadow-[0_20px_60px_rgba(56,189,248,0.55)] hover:-translate-y-0.5 hover:brightness-110',
  secondary:
    'bg-slate-900/70 text-slate-50 border border-slate-700 hover:border-brand-400 hover:text-white hover:bg-slate-900/90',
  ghost:
    'bg-transparent text-slate-200 hover:bg-slate-800/70 border border-transparent hover:border-slate-700',
};

const sizes = {
  md: 'text-sm px-5 py-2.5',
  lg: 'text-sm sm:text-base px-6 py-3',
};

const Button = ({
  as = 'button',
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...rest
}) => {
  const Component = as;
  return (
    <Component
      className={clsx(baseClasses, variants[variant], sizes[size], 'group', className)}
      {...rest}
    >
      <span className="translate-y-[0.5px]">{children}</span>
    </Component>
  );
};

export default Button;

