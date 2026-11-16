import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import LoginScreen from '@/app/login';

const mockLogin = jest.fn();
jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({ login: mockLogin }),
}));

const renderLogin = () =>
  render(
    <SafeAreaProvider
      initialMetrics={{
        frame: { x: 0, y: 0, width: 390, height: 844 },
        insets: { top: 0, left: 0, right: 0, bottom: 0 },
      }}
    >
      <LoginScreen />
    </SafeAreaProvider>,
  );

describe('<LoginScreen />', () => {
  beforeEach(() => mockLogin.mockReset());

  it('começa com campos vazios e sem atalhos de demonstração', async () => {
    await renderLogin();
    expect(screen.getByTestId('login-email').props.value).toBe('');
    expect(screen.getByTestId('login-password').props.value).toBe('');
    expect(screen.queryByText('Professor(a)')).toBeNull();
    expect(screen.queryByText('Aluno(a)')).toBeNull();
  });

  it('valida campos obrigatórios sem chamar a API', async () => {
    await renderLogin();
    await fireEvent.press(screen.getByTestId('login-submit'));

    expect(await screen.findAllByText('Campo obrigatório')).toHaveLength(2);
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('envia e-mail e senha e exibe erro da API', async () => {
    mockLogin.mockRejectedValue(new Error('E-mail ou senha inválidos'));
    await renderLogin();

    await fireEvent.changeText(screen.getByTestId('login-email'), 'felipe@gmail.com');
    await fireEvent.changeText(screen.getByTestId('login-password'), 'errada');
    await fireEvent.press(screen.getByTestId('login-submit'));

    await waitFor(() => expect(mockLogin).toHaveBeenCalledWith('felipe@gmail.com', 'errada'));
    expect(await screen.findByText('E-mail ou senha inválidos')).toBeTruthy();
  });
});
