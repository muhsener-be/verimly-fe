import React from 'react';

const Label = ({ children, className = '', ...props }) => {
  const baseStyles = 'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70';
  const classes = `${baseStyles} ${className}`;

  return (
    <label className={classes} {...props}>
      {children}
    </label>
  );
};

export default Label;