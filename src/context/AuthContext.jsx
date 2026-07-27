import { createContext, useState, useEffect, useCallback, useContext } from 'react';
import toast from 'react-hot-toast';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // true while we check for an existing session
  const [isAuthenticating, setIsAuthenticating] = useState(false); // true during login/register submit

  // On first load, try to restore the session from the httpOnly refresh
  // cookie (if the axios interceptor can silently refresh) by hitting /me.
  useEffect(() => {
    const bootstrapSession = async () => {
      try {
        const { data } = await authService.getCurrentUser();
        setUser(data.data.user);
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    bootstrapSession();
  }, []);

  const register = useCallback(async (payload) => {
    setIsAuthenticating(true);
    try {
      await authService.register(payload);
      toast.success('Account created! Please log in.');
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed.');
      return false;
    } finally {
      setIsAuthenticating(false);
    }
  }, []);

  const login = useCallback(async (payload) => {
    setIsAuthenticating(true);
    try {
      const { data } = await authService.login(payload);
      setUser(data.data.user);
      toast.success('Welcome back!');
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed.');
      return false;
    } finally {
      setIsAuthenticating(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // Even if the API call fails, clear local state so the UI doesn't
      // get stuck showing a logged-in user with a dead session.
    } finally {
      setUser(null);
      toast.success('Logged out.');
    }
  }, []);

  const updateUserInPlace = useCallback((partialUser) => {
    setUser((prev) => (prev ? { ...prev, ...partialUser } : prev));
  }, []);

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    isAuthenticating,
    register,
    login,
    logout,
    updateUserInPlace,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
