import { act, renderHook, waitFor } from '@testing-library/react-native';
import type { ReactNode } from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { authService } from '@/api/services';
import { tokenStorage } from '@/storage/tokenStorage';

jest.mock('@/api/services', () => ({
  authService: { login: jest.fn(), me: jest.fn(), updateMe: jest.fn() },
}));

const wrapper = ({ children }: { children: ReactNode }) => <AuthProvider>{children}</AuthProvider>;

const profile = (role: 'PROFESSOR' | 'ALUNO', name: string) => ({
  id: role === 'PROFESSOR' ? 't1' : 's1',
  name,
  email: `${name.toLowerCase()}@gmail.com`,
  role,
  phone: null,
  bio: null,
  subject: null,
  education: null,
  registration: null,
  classGroup: null,
  birthDate: null,
  guardianName: null,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
});

describe('AuthContext', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    await tokenStorage.clear();
  });

  it('login salva o token e carrega o perfil completo', async () => {
    (authService.login as jest.Mock).mockResolvedValue({ token: 'jwt-123', user: {} });
    (authService.me as jest.Mock).mockResolvedValue(profile('PROFESSOR', 'Felipe'));
    const { result } = await renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(() => result.current.login('Felipe@Gmail.com', '123456'));

    expect(authService.login).toHaveBeenCalledWith('felipe@gmail.com', '123456');
    expect(result.current.isTeacher).toBe(true);
    expect(await tokenStorage.get()).toBe('jwt-123');
  });

  it('aluno(a) autentica mas não é professor', async () => {
    (authService.login as jest.Mock).mockResolvedValue({ token: 'jwt-aluno', user: {} });
    (authService.me as jest.Mock).mockResolvedValue(profile('ALUNO', 'Maria'));
    const { result } = await renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(() => result.current.login('maria@gmail.com', '123456'));

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.isTeacher).toBe(false);
  });

  it('updateProfile troca o token e atualiza o usuário', async () => {
    await tokenStorage.set('jwt-antigo');
    (authService.me as jest.Mock).mockResolvedValue(profile('PROFESSOR', 'Felipe'));
    (authService.updateMe as jest.Mock).mockResolvedValue({
      token: 'jwt-novo',
      user: {},
      profile: profile('PROFESSOR', 'Felipe Andrade'),
    });
    const { result } = await renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.user?.name).toBe('Felipe'));

    await act(() => result.current.updateProfile({ name: 'Felipe Andrade' }));

    expect(result.current.user?.name).toBe('Felipe Andrade');
    expect(await tokenStorage.get()).toBe('jwt-novo');
  });

  it('descarta token inválido ao restaurar a sessão', async () => {
    await tokenStorage.set('jwt-expirado');
    (authService.me as jest.Mock).mockRejectedValue(new Error('401'));

    const { result } = await renderHook(() => useAuth(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.isAuthenticated).toBe(false);
    expect(await tokenStorage.get()).toBeNull();
  });
});
