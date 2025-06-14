// Token storage key
const TOKEN_KEY = 'auth_token';

// Set auth token in localStorage
export const setAuthToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
};

// Get auth token from localStorage
export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
};

// Remove auth token from localStorage
export const removeAuthToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};
