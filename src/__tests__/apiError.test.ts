import { ApiError, toApiError } from '@/api/client';

describe('toApiError', () => {
  it('usa a mensagem { error } do back-end', () => {
    const err = toApiError({ response: { status: 409, data: { error: 'E-mail já cadastrado' } } });
    expect(err).toBeInstanceOf(ApiError);
    expect(err.message).toBe('E-mail já cadastrado');
    expect(err.status).toBe(409);
  });

  it('formata o primeiro issue de validação do Zod', () => {
    const err = toApiError({
      response: { status: 400, data: { issues: [{ path: ['title'], message: 'Too short' }] } },
    });
    expect(err.message).toBe('title: Too short');
  });

  it('explica falha de rede com a URL da API', () => {
    const err = toApiError({ request: {}, message: 'Network Error' });
    expect(err.message).toMatch(/Não foi possível conectar à API/);
    expect(err.status).toBeUndefined();
  });
});
