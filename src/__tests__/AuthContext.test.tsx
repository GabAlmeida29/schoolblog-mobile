import { act, renderHook, waitFor } from '@testing-library/react-native';
import type { ReactNode } from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { authService } from '@/api/services';
import { tokenStorage } from '@/storage/tokenStorage';

jest.mock('@/api/services', () => ({
  authService: { login: jest.fn(), me: jest.fn() },
}));

const wrapper = ({ children }: { children: ReactNode }) => <AuthProvider>{children}</AuthProvider>;
const teacher = { id: 't1', name: 'Prof. Maria', email: 'professor@schoolblog.com', role: 'PROFESSOR' as const };
const student = { id: 's1', name: 'Lucas', email: 'aluno@schoolblog.com', role: 'ALUNO' as const };

describe('AuthContext', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    await tokenStorage.clear();
  });

  it('login de professor(a) salva o token e libera permissões de professor', async () => {
    (authService.login as jest.Mock).mockResolvedValue({ token: 'jwt-123', user: teacher });
    const { result } = await renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(() => result.current.login('professor@schoolblog.com', 'docente123'));

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.isTeacher).toBe(true);
    expect(await tokenStorage.get()).toBe('jwt-123');
  });

  it('aluno(a) autentica mas não é professor', async () => {
    (authService.login as jest.Mock).mockResolvedValue({ token: 'jwt-aluno', user: student });
    const { result } = await renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(() => result.current.login('aluno@schoolblog.com', 'aluno123'));

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.isTeacher).toBe(false);
  });

  it('restaura a sessão salva validando o token em /auth/me', async () => {
    await tokenStorage.set('jwt-salvo');
    (authService.me as jest.Mock).mockResolvedValue(teacher);

    const { result } = await renderHook(() => useAuth(), { wrapper });

    await waitFor(() => expect(result.current.user).toEqual(teacher));
    expect(authService.me).toHaveBeenCalled();
  });

  it('descarta token inválido e o logout limpa a sessão', async () => {
    await tokenStorage.set('jwt-expirado');
    (authService.me as jest.Mock).mockRejectedValue(new Error('401'));

    const { result } = await renderHook(() => useAuth(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.isAuthenticated).toBe(false);
    expect(await tokenStorage.get()).toBeNull();
  });
});
