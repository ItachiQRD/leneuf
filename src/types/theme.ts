// types/theme.ts

/**
 * Représente le mode d'affichage principal de l'application
 */
export type ThemeMode = 'light' | 'dark' | 'system';

/**
 * Schémas de couleurs disponibles dans l'application
 */
export type ColorScheme = 'stone' | 'slate' | 'zinc' | 'neutral' | 'orange';

/**
 * Niveaux de contraste pour l'accessibilité
 */
export type ContrastLevel = 'normal' | 'high';

/**
 * Tailles de police disponibles
 */
export type FontSize = 'sm' | 'md' | 'lg';

/**
 * Rayons de bordure disponibles
 */
export type Radius = 'none' | 'sm' | 'md' | 'lg' | 'full';

/**
 * Configuration complète du thème
 */
export interface ThemeConfig {
  mode: ThemeMode;
  colorScheme: ColorScheme;
  contrast: ContrastLevel;
  fontSize: FontSize;
  radius: Radius;
  reducedMotion: boolean;
}

/**
 * Paramètres par défaut du thème
 */
export const defaultTheme: ThemeConfig = {
  mode: 'system',
  colorScheme: 'neutral',
  contrast: 'normal',
  fontSize: 'md',
  radius: 'md',
  reducedMotion: false,
} as const;

/**
 * Type pour les mises à jour partielles du thème
 */
export type ThemeUpdate = Partial<ThemeConfig>;