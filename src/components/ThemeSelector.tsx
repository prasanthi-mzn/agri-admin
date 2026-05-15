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
    <div className={`flex items-center gap-2 p-1 rounded-lg ${
      isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
    }`}>
      {themes.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => setTheme(id as typeof id)}
          title={label}
          className={`p-2 rounded-md transition-all ${
            theme === id
              ? isDarkMode ? 'bg-gray-600 shadow-md' : 'bg-white shadow-md'
              : isDarkMode ? 'bg-transparent hover:bg-gray-600' : 'bg-transparent hover:bg-gray-200'
          }`}
        >
          <Icon 
            size={18} 
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
