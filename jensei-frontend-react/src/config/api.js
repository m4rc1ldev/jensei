/**
 * API Configuration
 * Centralized API URL configuration for the application
 */

// Determine API URL based on environment
const getApiUrl = () => {
  // 1. Check for explicit environment variable (highest priority)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.replace(/\/$/, ""); // Remove trailing slash
  }

  // 2. Default to localhost for development
  return "http://localhost:3000";
};

export const API_URL = getApiUrl();

const getChatApiUrl = () => {
  // Use VITE_API_URL for chat endpoints too
  if (import.meta.env.VITE_API_URL) {
    const baseUrl = import.meta.env.VITE_API_URL.replace(/\/$/, "");
    return `${baseUrl}/chat/api`;
  }

  // Default to localhost for development
  return "http://localhost:8000";
};

export const CHAT_API_URL = getChatApiUrl();

// Log API URL in development (helps with debugging)
if (import.meta.env.DEV) {
  console.log("🔗 API URL:", API_URL);
}
