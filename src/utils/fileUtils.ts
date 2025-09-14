/**
 * Utilitaires pour la gestion des fichiers
 */

/**
 * Vérifie si une valeur est un objet File
 * @param value - La valeur à vérifier
 * @returns true si c'est un File, false sinon
 */
export function isFile(value: any): value is File {
  return value && typeof value === 'object' && value.constructor === File;
}

/**
 * Vérifie si une valeur est une string (URL d'image)
 * @param value - La valeur à vérifier
 * @returns true si c'est une string, false sinon
 */
export function isImageUrl(value: any): value is string {
  return typeof value === 'string' && value.length > 0;
}

/**
 * Vérifie si une valeur est un fichier ou une URL d'image
 * @param value - La valeur à vérifier
 * @returns true si c'est un File ou une string, false sinon
 */
export function isFileOrImageUrl(value: any): value is File | string {
  return isFile(value) || isImageUrl(value);
}
