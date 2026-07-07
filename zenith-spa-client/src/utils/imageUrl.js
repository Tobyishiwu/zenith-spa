const API_URL = import.meta.env.VITE_SERVER_URL;

export const imageUrl = (path) => {
  if (!path) return "";

  if (path.startsWith("http")) {
    return path;
  }

  return `${API_URL}${path}`;
};