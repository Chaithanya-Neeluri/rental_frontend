import React from 'react';
import clsx from 'clsx';

// Responsive max-width container to keep layout consistent
const Container = ({ className = '', children }) => {
  return (
    <div className={clsx('mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8', className)}>
      {children}
    </div>
  );
};

export default Container;

