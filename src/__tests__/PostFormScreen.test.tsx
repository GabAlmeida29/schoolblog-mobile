import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import type { ReactNode } from 'react';
import { PostFormScreen } from '@/screens/PostFormScreen';

const mockMutateAsync = jest.fn();
const mockPost = {
  id: 'p1',
  title: 'Título original',
  content: 'Conteúdo original',
  author: 'João Santos',
  createdAt: '2026-09-20T12:00:00.000Z',
  updatedAt: '2026-09-20T12:00:00.000Z',
};

jest.mock('expo-router', () => {
  const { View } = jest.requireActual('react-native');
  return {
    router: { back: jest.fn(), replace: jest.fn(), dismissAll: jest.fn() },
    Stack: {
      Screen: ({
        options,
      }: {
        options: { headerLeft?: () => ReactNode; headerRight?: () => ReactNode };
      }) => (
        <View>
          {options.headerLeft?.()}
          {options.headerRight?.()}
        </View>
      ),
    },
  };
});
jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({ user: { name: 'Felipe Andrade' } }),
}));
jest.mock('@/hooks/usePosts', () => ({
  usePost: (id?: string) => ({ data: id ? mockPost : undefined, isLoading: false, isError: false }),
  useSavePost: () => ({ mutateAsync: mockMutateAsync }),
  useDeletePost: () => ({ mutate: jest.fn() }),
}));

const saveDisabled = () => screen.getByTestId('form-save').props.accessibilityState.disabled;

describe('<PostFormScreen />', () => {
  beforeEach(() => mockMutateAsync.mockReset().mockResolvedValue({ id: 'p1' }));

  it('criação: autor vem do usuário logado e fica bloqueado', async () => {
    await render(<PostFormScreen />);
    expect(screen.getByTestId('locked-field').props.children).toBe('Felipe Andrade');
    expect(screen.queryByTestId('delete-post')).toBeNull();
  });

  it('edição: mantém o autor original e só habilita salvar após alteração', async () => {
    await render(<PostFormScreen id="p1" />);

    expect(screen.getByTestId('locked-field').props.children).toBe('João Santos');
    await waitFor(() => expect(screen.getByTestId('post-title').props.value).toBe('Título original'));
    expect(saveDisabled()).toBe(true);

    await fireEvent.changeText(screen.getByTestId('post-title'), 'Título novo');
    await waitFor(() => expect(saveDisabled()).toBe(false));

    await fireEvent.press(screen.getByTestId('form-save'));
    await waitFor(() =>
      expect(mockMutateAsync).toHaveBeenCalledWith({ title: 'Título novo', content: 'Conteúdo original' }),
    );
  });

  it('edição: voltar ao valor original desabilita salvar novamente', async () => {
    await render(<PostFormScreen id="p1" />);
    await waitFor(() => expect(screen.getByTestId('post-title').props.value).toBe('Título original'));

    await fireEvent.changeText(screen.getByTestId('post-title'), 'Outro');
    await fireEvent.changeText(screen.getByTestId('post-title'), 'Título original');
    await waitFor(() => expect(saveDisabled()).toBe(true));
  });

  it('edição: oferece excluir a publicação', async () => {
    await render(<PostFormScreen id="p1" />);
    expect(screen.getByTestId('delete-post')).toBeTruthy();
  });
});
