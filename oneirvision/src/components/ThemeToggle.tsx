import { useState, useEffect } from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';

const ThemeToggle = () => {
  const [darkMode, setDarkMode] = useState(false);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const isDark = localStorage.theme === 'dark' || 
      (!('theme' in localStorage) && 
       window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    setDarkMode(isDark);
    updateTheme(isDark);
  }, []);

  // Update theme class and save preference
  const updateTheme = (isDark: boolean) => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
    }
  };

  // Toggle theme
  const toggleTheme = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    updateTheme(newDarkMode);
  };

  return (
    <button
      onClick={toggleTheme}
      className="fixed bottom-8 right-24 z-50 p-3 rounded-full bg-white/5 backdrop-blur-lg border border-white/10 hover:bg-white/10 transition-colors shadow-lg hover:shadow-xl"
      aria-label={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
    >
      {darkMode ? (
        <FiSun className="w-5 h-5 text-yellow-300" />
      ) : (
        <FiMoon className="w-5 h-5 text-indigo-400" />
      )}
    </button>
  );
};

export default ThemeToggle;
