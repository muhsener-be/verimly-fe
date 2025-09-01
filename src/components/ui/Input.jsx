import React from 'react';

const Input = ({ className = '', type, ...props }) => {
  const baseStyles = 'flex h-10 w-full rounded-md border border-gray-200 bg-transparent px-3 py-2 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50';
  const classes = `${baseStyles} ${className}`;

  return (
    <input type={type} className={classes} {...props} />
  );
};

export default Input;