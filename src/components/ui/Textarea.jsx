import React from 'react';

const Textarea = ({ className = '', ...props }) => {
  const baseStyles = 'flex min-h-[80px] w-full rounded-md border border-gray-200 bg-transparent px-3 py-2 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50';
  const classes = `${baseStyles} ${className}`;

  return (
    <textarea className={classes} {...props} />
  );
};

export default Textarea;