import axios, { AxiosResponse } from 'axios';
import { AuthResponse, LoginFormData, RegisterFormData, ChangePasswordFormData, User } from '@/types/auth';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage or cookies
    const token = typeof window !== 'undefined' 
      ? localStorage.getItem('auth_token') || document.cookie
          .split('; ')
          .find(row => row.startsWith('auth_token='))
          ?.split('=')[1]
      : null;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - redirect to login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        document.cookie = 'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        // You can add a redirect to login page here if needed
        // window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

export class AuthAPI {
  // Register new user
  static async register(data: RegisterFormData): Promise<AuthResponse> {
    try {
      const response: AxiosResponse<AuthResponse> = await api.post('/auth/register', {
        email: data.email,
        password: data.password,
        name: data.name,
        phone: data.phone,
        role: data.role
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      return {
        success: false,
        message: 'Network error occurred during registration'
      };
    }
  }

  // Login user
  static async login(data: LoginFormData): Promise<AuthResponse> {
    try {
      const response: AxiosResponse<AuthResponse> = await api.post('/auth/login', {
        email: data.email,
        password: data.password
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      return {
        success: false,
        message: 'Network error occurred during login'
      };
    }
  }

  // Logout user
  static async logout(): Promise<AuthResponse> {
    try {
      const response: AxiosResponse<AuthResponse> = await api.post('/auth/logout');
      return response.data;
    } catch (error: any) {
      // Even if logout fails on server, we should clear local storage
      return {
        success: true,
        message: 'Logged out successfully'
      };
    }
  }

  // Get user profile
  static async getProfile(): Promise<{ success: boolean; data?: { user: User }; message: string }> {
    try {
      const response = await api.get('/auth/profile');
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      return {
        success: false,
        message: 'Failed to fetch user profile'
      };
    }
  }

  // Change password
  static async changePassword(data: ChangePasswordFormData): Promise<AuthResponse> {
    try {
      const response: AxiosResponse<AuthResponse> = await api.put('/auth/change-password', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      return {
        success: false,
        message: 'Network error occurred during password change'
      };
    }
  }

  // Verify token (useful for route protection)
  static async verifyToken(): Promise<{ valid: boolean; user?: User }> {
    try {
      const response = await api.get('/auth/verify');
      return {
        valid: response.data.success,
        user: response.data.data?.user
      };
    } catch (error) {
      return { valid: false };
    }
  }

  // Refresh token if your backend supports it
  static async refreshToken(): Promise<AuthResponse> {
    try {
      const response: AxiosResponse<AuthResponse> = await api.post('/auth/refresh');
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      return {
        success: false,
        message: 'Failed to refresh token'
      };
    }
  }
}

// Export the configured axios instance for other API calls
export default api;
