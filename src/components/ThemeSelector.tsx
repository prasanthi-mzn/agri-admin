import React from 'react';
import { Sun, Moon, Zap, Heart } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const ThemeSelector = () => {
  const { theme, setTheme } = useTheme();

  const themes = [
    { id: 'light', label: 'Light', icon: Sun },
    { id: 'dark', label: 'Dark', icon: Moon },
    { id: 'neon', label: 'Neon', icon: Zap },
    { id: 'pink', label: 'Pink', icon: Heart },
  ] as const;

  const isDarkMode = theme === 'dark' || theme === 'neon' || theme === 'pink';

  return (
    <div className={`flex w-full items-center justify-center gap-1 rounded-lg p-1 sm:w-auto sm:gap-2 ${
      isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
    }`}>
      {themes.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => setTheme(id as typeof id)}
          title={label}
        className={`rounded-md p-1.5 transition-all sm:p-2 border ${
  theme === id 
    ? 'bg-common-btn-bg text-white shadow-md border-transparent' 
    : 'bg-white text-grey hover:bg-gray-100 border-gray-300'
}`}
        >
          <Icon 
            size={16} 
            className={theme === id 
              ? isDarkMode ? 'text-white' : 'text-gray-900'
              : isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }
          />
        </button>
      ))}
    </div>
  );
};
