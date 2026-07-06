const API_URL = "http://localhost:5000";

export const imageUrl = (path) => {
  if (!path) return null;

  if (path.startsWith("http")) {
    return path;
  }

  return `${API_URL}${path}`;
};