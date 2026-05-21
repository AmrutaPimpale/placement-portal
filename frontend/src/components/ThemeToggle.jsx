import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { initTheme, toggleTheme } from '../utils/theme';

const ThemeToggle = () => {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    initTheme();
    setDark(document.documentElement.classList.contains('dark'));
  }, []);

  const handleToggle = () => {
    const newTheme = toggleTheme();
    setDark(newTheme === 'dark');
  };

  return (
    <button
      onClick={handleToggle}
      className="p-2 text-slate-500 rounded-lg hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
      aria-label="Toggle Dark Mode"
    >
      {dark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
    </button>
  );
};

export default ThemeToggle;
