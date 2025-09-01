import React from 'react';
import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';

const Logo = () => {
  return (
    <Link to="/" className="flex items-center justify-center gap-2">
      <Clock className="h-6 w-6 text-emerald-600" />
      <span className="text-xl font-bold">Verimly</span>
    </Link>
  );
};

export default Logo;