
import { User } from '../types';

// Configuration for API endpoints
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const authService = {
  /**
   * Initiates Google OAuth flow by redirecting to backend OAuth endpoint
   */
  loginWithGoogle: async (): Promise<User> => {
    try {
      // Redirect to backend OAuth endpoint
      window.location.href = `${API_URL}/auth/google`;
      
      // Return a promise that never resolves since we're redirecting
      return new Promise(() => {});
    } catch (error) {
      console.error("Google login failed", error);
      throw new Error('Failed to initiate Google login');
    }
  },

  /**
   * Initiates GitHub OAuth flow by redirecting to backend OAuth endpoint
   */
  loginWithGithub: async (): Promise<User> => {
    try {
      // Redirect to backend OAuth endpoint
      window.location.href = `${API_URL}/auth/github`;
      
      // Return a promise that never resolves since we're redirecting
      return new Promise(() => {});
    } catch (error) {
      console.error("GitHub login failed", error);
      throw new Error('Failed to initiate GitHub login');
    }
  },

  /**
   * Email/password login
   */
  loginWithEmail: async (email: string, password: string = 'temp'): Promise<User> => {
    try {
      const response = await fetch(`${API_URL}/auth/email`, { 
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        credentials: 'include', // Important for cookies/sessions
        body: JSON.stringify({ email, password }) 
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Authentication failed');
      }
      
      return await response.json();
    } catch (error) {
      console.error("Email login failed", error);
      throw error;
    }
  },

  /**
   * Get current authenticated user
   */
  getCurrentUser: async (): Promise<User | null> => {
    try {
      const response = await fetch(`${API_URL}/auth/user`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        return null;
      }
      
      return await response.json();
    } catch (error) {
      console.error("Failed to get current user", error);
      return null;
    }
  },

  /**
   * Logout user
   */
  logout: async (): Promise<void> => {
    try {
      await fetch(`${API_URL}/auth/logout`, { 
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error("Logout failed", error);
      throw error;
    }
  }
};
