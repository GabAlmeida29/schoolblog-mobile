import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { setAuthToken, setUnauthorizedHandler } from '@/api/client';
import { authService } from '@/api/services';
import { tokenStorage } from '@/storage/tokenStorage';
import type { AuthUser } from '@/types';

interface AuthContextValue {
  user: AuthUser | null;
  /** true enquanto restaura a sessão salva (evita piscar a tela de login). */
  isLoading: boolean;
  isAuthenticated: boolean;
  isTeacher: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(async () => {
    setAuthToken(null);
    setUser(null);
    await tokenStorage.clear();
  }, []);

  // Restaura a sessão: lê o token do SecureStore e valida no back-end (GET /auth/me).
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const token = await tokenStorage.get();
        if (!token) return;
        setAuthToken(token);
        const me = await authService.me();
        if (active) setUser(me);
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

  // Token expirado/inválido em qualquer requisição => volta para o login.
  useEffect(() => {
    setUnauthorizedHandler(() => void logout());
    return () => setUnauthorizedHandler(null);
  }, [logout]);

  const login = useCallback(async (email: string, password: string) => {
    const { token, user: loggedUser } = await authService.login(email.trim(), password);
    setAuthToken(token);
    await tokenStorage.set(token);
    setUser(loggedUser);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      isAuthenticated: !!user,
      isTeacher: user?.role === 'PROFESSOR',
      login,
      logout,
    }),
    [user, isLoading, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  return context;
}
