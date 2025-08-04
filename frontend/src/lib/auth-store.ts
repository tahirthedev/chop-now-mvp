import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import Cookies from 'js-cookie';
import { User, AuthState } from '@/types/auth';

interface AuthStore extends AuthState {
  // Actions
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
  clearError: () => void;
  updateUser: (userData: Partial<User>) => void;
  refreshUser: () => Promise<void>;
}

// Token storage utilities
const tokenStorage = {
  getToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token') || Cookies.get('auth_token') || null;
  },
  setToken: (token: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('auth_token', token);
    Cookies.set('auth_token', token, { 
      expires: 7, // 7 days
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });
  },
  removeToken: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('auth_token');
    Cookies.remove('auth_token');
  }
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      setUser: (user: User | null) => {
        set({ user, isAuthenticated: !!user });
      },

      setToken: (token: string | null) => {
        if (token) {
          tokenStorage.setToken(token);
        } else {
          tokenStorage.removeToken();
        }
        set({ token, isAuthenticated: !!token });
      },

      setLoading: (isLoading: boolean) => {
        set({ isLoading });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      login: (user: User, token: string) => {
        tokenStorage.setToken(token);
        set({
          user,
          token,
          isAuthenticated: true,
          error: null,
          isLoading: false
        });
      },

      logout: () => {
        tokenStorage.removeToken();
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
          isLoading: false
        });
      },

      clearError: () => {
        set({ error: null });
      },

      updateUser: (userData: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: { ...currentUser, ...userData }
          });
        }
      },

      refreshUser: async () => {
        // Skip refresh during SSR
        if (typeof window === 'undefined') {
          return;
        }

        const state = get();
        const token = state.token || tokenStorage.getToken();
        
        if (!token) {
          // Only logout if we're currently authenticated
          if (state.isAuthenticated) {
            state.logout();
          }
          return;
        }

        // Don't refresh if already in progress
        if (state.isLoading) {
          return;
        }

        try {
          set({ isLoading: true, error: null });
          
          // For now, just validate that we have a token
          // TODO: Implement proper user profile endpoint validation
          if (token && !state.isAuthenticated) {
            set({
              token,
              isAuthenticated: true,
              isLoading: false
            });
          } else {
            set({ isLoading: false });
          }
        } catch (error) {
          console.error('Error refreshing user:', error);
          get().logout();
        } finally {
          set({ isLoading: false });
        }
      }
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => {
        if (typeof window === 'undefined') {
          return {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {}
          };
        }
        return localStorage;
      }),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Restore token from cookies/localStorage on hydration
          const token = tokenStorage.getToken();
          if (token && state.user) {
            state.token = token;
            state.isAuthenticated = true;
          } else if (!token) {
            // Token expired or missing, clear auth state
            state.user = null;
            state.isAuthenticated = false;
            state.token = null;
          }
        }
      }
    }
  )
);

// Helper hook to get token for API calls
export const useAuthToken = () => {
  const token = useAuthStore(state => state.token);
  return token || tokenStorage.getToken();
};
