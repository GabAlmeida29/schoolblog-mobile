import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import LoginScreen from '@/app/login';

const mockLogin = jest.fn();
jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({ login: mockLogin }),
}));

describe('<LoginScreen />', () => {
  beforeEach(() => mockLogin.mockReset());

  it('valida campos obrigatórios sem chamar a API', async () => {
    await render(<LoginScreen />);
    await fireEvent.press(screen.getByTestId('login-submit'));

    expect(await screen.findByText('Informe o e-mail')).toBeTruthy();
    expect(screen.getByText('Informe a senha')).toBeTruthy();
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('envia e-mail e senha para o AuthContext', async () => {
    mockLogin.mockResolvedValue(undefined);
    await render(<LoginScreen />);

    await fireEvent.changeText(screen.getByTestId('login-email'), 'professor@schoolblog.com');
    await fireEvent.changeText(screen.getByTestId('login-password'), 'docente123');
    await fireEvent.press(screen.getByTestId('login-submit'));

    await waitFor(() => expect(mockLogin).toHaveBeenCalledWith('professor@schoolblog.com', 'docente123'));
  });

  it('exibe a mensagem de erro da API', async () => {
    mockLogin.mockRejectedValue(new Error('E-mail ou senha inválidos'));
    await render(<LoginScreen />);

    await fireEvent.changeText(screen.getByTestId('login-email'), 'professor@schoolblog.com');
    await fireEvent.changeText(screen.getByTestId('login-password'), 'errada');
    await fireEvent.press(screen.getByTestId('login-submit'));

    expect(await screen.findByText('E-mail ou senha inválidos')).toBeTruthy();
  });
});
