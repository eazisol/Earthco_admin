// Utility functions for authentication

/**
 * Check if the current user is authenticated
 * @returns {boolean}
 */
export const isAuthenticated = () => {
  try {
    const user = localStorage.getItem('user');
    if (!user) return false;
    
    const parsedUser = JSON.parse(user);
    return !!(parsedUser?.token?.data);
  } catch (error) {
    // console.error('Error checking authentication:', error);
    return false;
  }
};

/**
 * Get the current user data
 * @returns {Object|null}
 */
export const getCurrentUser = () => {
  try {
    const user = localStorage.getItem('user');
    if (!user) return null;
    
    const parsedUser = JSON.parse(user);
    return parsedUser?.token?.data ? parsedUser : null;
  } catch (error) {
    // console.error('Error getting current user:', error);
    return null;
  }
};

/**
 * Clear user data and redirect to login
 */
export const clearUserAndRedirect = () => {
  localStorage.removeItem('user');
  // Add a small delay to allow toast messages to display
  setTimeout(() => {
    window.location.href = '/login';
  }, 500);
};

/**
 * Check if token is expired (if it's a JWT token)
 * @param {string} token - The JWT token
 * @returns {boolean}
 */
export const isTokenExpired = (token) => {
  if (!token) return true;
  
  try {
    // Try to decode JWT token (if it's a JWT)
    const base64Url = token.split('.')[1];
    if (!base64Url) return false; // Not a JWT token
    
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    const payload = JSON.parse(jsonPayload);
    const currentTime = Date.now() / 1000;
    
    return payload.exp < currentTime;
  } catch (error) {
    // If we can't decode the token, assume it's not expired
    return false;
  }
};
