import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { setAuthToken, setUnauthorizedHandler } from '@/api/client';
import { authService } from '@/api/services';
import { tokenStorage } from '@/storage/tokenStorage';
import type { UpdateMeInput, User } from '@/types';

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isTeacher: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (input: UpdateMeInput) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(async () => {
    setAuthToken(null);
    setUser(null);
    await tokenStorage.clear();
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const token = await tokenStorage.get();
        if (!token) return;
        setAuthToken(token);
        const profile = await authService.me();
        if (active) setUser(profile);
      } catch {
        await logout();
      } finally {
        if (active) setIsLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [logout]);

  useEffect(() => {
    setUnauthorizedHandler(() => void logout());
    return () => setUnauthorizedHandler(null);
  }, [logout]);

  const login = useCallback(async (email: string, password: string) => {
    const { token } = await authService.login(email.trim().toLowerCase(), password);
    setAuthToken(token);
    await tokenStorage.set(token);
    setUser(await authService.me());
  }, []);

  const updateProfile = useCallback(async (input: UpdateMeInput) => {
    const { token, profile } = await authService.updateMe(input);
    setAuthToken(token);
    await tokenStorage.set(token);
    setUser(profile);
  }, []);

  const refreshProfile = useCallback(async () => {
    setUser(await authService.me());
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      isAuthenticated: !!user,
      isTeacher: user?.role === 'PROFESSOR',
      login,
      logout,
      updateProfile,
      refreshProfile,
    }),
    [user, isLoading, login, logout, updateProfile, refreshProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  return context;
}
