const SERVER_URL =
  import.meta.env.VITE_SERVER_URL || "http://localhost:5000";

export const imageUrl = (path) => {
  if (!path) return null;

  // Cloudinary or any external URL
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  // Legacy local upload
  return `${SERVER_URL}${path}`;
};

export default imageUrl;