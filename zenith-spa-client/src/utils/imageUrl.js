/**
 * Resolves an image path to a fully qualified URL.
 *
 * - Cloudinary URLs (https://res.cloudinary.com/...) are returned unchanged.
 * - Any URL already starting with http:// or https:// is returned unchanged.
 * - Legacy relative paths (/uploads/therapists/file.jpg) are prefixed with
 *   the backend base URL so existing records continue to display correctly.
 *
 * @param {string|null|undefined} path
 * @returns {string|null}
 */
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const imageUrl = (path) => {
  if (!path) return null;
  // Already a full URL — Cloudinary or any external source
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  // Legacy local upload path — prepend backend origin
  return `${API_URL}${path}`;
};

export default imageUrl;
