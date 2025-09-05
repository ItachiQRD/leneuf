// components/theme/ThemeSwitcher.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sun, Monitor, Palette, ZoomIn, Type, RotateCcw } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/Buttons';
import { TooltipProvider, Default as TooltipComponent } from '@/components/ui/ToolTip';

export function ThemeSwitcher() {
  const { theme, updateTheme, resetTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  // Configuration des options de thème avec leurs labels et icônes
  const themeOptions = [
    { value: 'light' as const, icon: Sun, label: 'Mode clair' },
    { value: 'dark' as const, icon: Moon, label: 'Mode sombre' },
    { value: 'system' as const, icon: Monitor, label: 'Système' }
  ];

  // Configuration des schémas de couleur avec leurs propriétés visuelles
  const colorSchemes = [
    { value: 'stone' as const, label: 'Pierre', class: 'bg-stone-500' },
    { value: 'slate' as const, label: 'Ardoise', class: 'bg-slate-500' },
    { value: 'zinc' as const, label: 'Zinc', class: 'bg-zinc-500' },
    { value: 'neutral' as const, label: 'Neutre', class: 'bg-neutral-500' },
    { value: 'orange' as const, label: 'Orange', class: 'bg-orange-500' }
  ];

  return (
    <TooltipProvider>
      <div className="relative inline-block">
        <div className="flex items-center gap-2 p-2 rounded-lg bg-surface-200">
          {/* Boutons de mode de thème */}
          {themeOptions.map(({ value, icon: Icon, label }) => (
            <TooltipComponent
              key={value}
              content={label}
              side="bottom"
              variant="dark"
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={() => updateTheme({ mode: value })}
                className={`${
                  theme.mode === value
                    ? 'bg-primary text-white'
                    : 'hover:bg-surface-300'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="sr-only">{label}</span>
              </Button>
            </TooltipComponent>
          ))}
          
          <div className="w-px h-6 bg-border-light" />
          
          {/* Bouton des options de thème */}
          <TooltipComponent
            content="Options du thème"
            side="bottom"
            variant="dark"
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
            >
              <Palette className="w-5 h-5" />
              <span className="sr-only">Options du thème</span>
            </Button>
          </TooltipComponent>

          {/* Bouton de réinitialisation */}
          <TooltipComponent
            content="Réinitialiser le thème"
            side="bottom"
            variant="dark"
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={resetTheme}
            >
              <RotateCcw className="w-5 h-5" />
              <span className="sr-only">Réinitialiser le thème</span>
            </Button>
          </TooltipComponent>
        </div>

        {/* Panel d'options de thème */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute right-0 mt-2 p-4 rounded-lg bg-surface-100 shadow-lg border border-border-light min-w-[240px]"
            >
              {/* Schémas de couleurs */}
              <div className="mb-4">
                <h3 className="text-sm font-medium mb-2">Schéma de couleurs</h3>
                <div className="grid grid-cols-5 gap-2">
                  {colorSchemes.map(({ value, label, class: bgClass }) => (
                    <TooltipComponent
                      key={value}
                      content={label}
                      side="top"
                      variant="dark"
                    >
                      <button
                        onClick={() => updateTheme({ colorScheme: value })}
                        className={`w-8 h-8 rounded-full transition-transform hover:scale-110 ${bgClass} ${
                          theme.colorScheme === value ? 'ring-2 ring-primary ring-offset-2' : ''
                        }`}
                      >
                        <span className="sr-only">{label}</span>
                      </button>
                    </TooltipComponent>
                  ))}
                </div>
              </div>

              {/* Options supplémentaires */}
              {/* ... autres sections du panel ... */}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </TooltipProvider>
  );
}