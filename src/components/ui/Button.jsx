import React from 'react';

// Bu bileşen artık daha fazla "prop" (özellik) alacak:
// - variant: 'default' (ana buton), 'ghost' (sade buton) gibi stiller.
// - size: 'default' (normal), 'sm' (küçük), 'lg' (büyük) gibi boyutlar.
// - className: Dışarıdan ekstra stil eklemek için.
// - children: Butonun içindeki metin veya ikon.
const Button = ({ children, variant = 'default', size = 'default', className = '', ...props }) => {
  // --- Stil Tanımlamaları ---
  
  // Temel Stiller (her butonda olacak)
  const baseStyles = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

  // Varyant Stilleri (görünüm)
  const variantStyles = {
    // 'default' varyantını tasarımdaki yeşil butona göre güncelledik.
    default: 'bg-emerald-600 text-white hover:bg-emerald-700',
    ghost: 'hover:bg-gray-100 hover:text-gray-900',
    // Bir de dışı çizgili bir buton stili ekleyelim, giriş yap butonu için.
    outline: 'border border-gray-200 bg-transparent hover:bg-gray-100'
  };

  // Boyut Stilleri
  const sizeStyles = {
    default: 'h-10 py-2 px-4',
    sm: 'h-9 px-3 rounded-md',
    lg: 'h-11 px-8 rounded-md',
  };

  // Bütün stil sınıflarını birleştiriyoruz
  const classes = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};

export default Button;