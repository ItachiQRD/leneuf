import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Monitor, Palette } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

export function ThemeSelector() {
  const { theme, setTheme, colorScheme, setColorScheme } = useTheme();
  const [showColorSchemes, setShowColorSchemes] = useState(false);

  const themeOptions = [
    { value: 'light' as const, icon: Sun, label: 'Clair' },
    { value: 'dark' as const, icon: Moon, label: 'Sombre' },
    { value: 'system' as const, icon: Monitor, label: 'Système' },
  ];

  const colorSchemes = [
    { value: 'orange' as const, label: 'Orange', color: '#f97316' },
    { value: 'blue' as const, label: 'Bleu', color: '#3b82f6' },
    { value: 'green' as const, label: 'Vert', color: '#22c55e' },
    { value: 'purple' as const, label: 'Violet', color: '#a855f7' },
    { value: 'pink' as const, label: 'Rose', color: '#ec4899' },
  ];

  return (
    <div className="relative">
      <div className="flex items-center space-x-2 rounded-lg bg-background-secondary p-2">
        {themeOptions.map(({ value, icon: Icon, label }) => (
          <button
            key={value}
            onClick={() => setTheme(value)}
            className={`flex items-center justify-center p-2 rounded-md transition-colors ${
              theme === value
                ? 'bg-primary-500 text-white'
                : 'hover:bg-primary-100 text-gray-600 dark:text-gray-300'
            }`}
            title={label}
          >
            <Icon className="h-5 w-5" />
          </button>
        ))}
        <div className="w-px h-6 bg-border-color" />
        <button
          onClick={() => setShowColorSchemes(!showColorSchemes)}
          className="flex items-center justify-center p-2 rounded-md hover:bg-primary-100 text-gray-600 dark:text-gray-300"
          title="Changer de couleur"
        >
          <Palette className="h-5 w-5" />
        </button>
      </div>

      <AnimatePresence>
        {showColorSchemes && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute right-0 mt-2 p-2 bg-background-primary rounded-lg shadow-lg border border-border-color grid grid-cols-5 gap-2"
          >
            {colorSchemes.map(({ value, label, color }) => (
              <button
                key={value}
                onClick={() => {
                  setColorScheme(value);
                  setShowColorSchemes(false);
                }}
                className={`w-8 h-8 rounded-full transition-transform hover:scale-110 ${
                  colorScheme === value ? 'ring-2 ring-offset-2 ring-primary-500' : ''
                }`}
                style={{ backgroundColor: color }}
                title={label}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}