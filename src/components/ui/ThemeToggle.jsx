import React from 'react';
import { useTheme } from '../../contexts/ThemeProvider';
import { Sun, Moon } from 'lucide-react';
import Button from './Button';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button variant="ghost" size="sm" onClick={toggleTheme} className="w-10 h-10 px-0">
      {theme === 'light' ? <Sun size={20} /> : <Moon size={20} />}
    </Button>
  );
};

export default ThemeToggle;