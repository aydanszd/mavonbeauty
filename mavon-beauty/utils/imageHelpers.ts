import { API_ORIGIN } from '../config/api';

/**
 * Turn a stored image path (relative or absolute) into a usable URL.
 *
 * - if the value already starts with http[s] we assume it is complete and
 *   return as-is (this covers CDN links or external images).
 * - if it begins with a slash we prepend the API origin.
 * - otherwise we treat it as a path segment and join it to the origin.
 */
export function getFullImageUrl(imagePath: string): string {
  if (!imagePath || typeof imagePath !== 'string') return '';
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  if (imagePath.startsWith('/')) {
    return `${API_ORIGIN}${imagePath}`;
  }
  return `${API_ORIGIN}/${imagePath}`;
}
