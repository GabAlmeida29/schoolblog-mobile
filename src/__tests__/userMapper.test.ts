import { emptyUserForm, formToUserInput, userToForm } from '@/utils/userMapper';
import type { User } from '@/types';

describe('userMapper', () => {
  const values = {
    ...emptyUserForm,
    name: ' Maria Oliveira ',
    email: 'maria@gmail.com',
    phone: '(11) 91234-5678',
    subject: 'Matemática',
    registration: '2026001',
    classGroup: '9º ano A',
    birthDate: '15/03/2011',
  };

  it('professor envia apenas campos docentes', () => {
    const input = formToUserInput('teachers', values);
    expect(input).toMatchObject({ name: 'Maria Oliveira', phone: '11912345678', subject: 'Matemática' });
    expect(input).not.toHaveProperty('registration');
    expect(input).not.toHaveProperty('password');
  });

  it('aluno envia campos escolares e converte a data para ISO', () => {
    const input = formToUserInput('students', { ...values, password: '123456' });
    expect(input).toMatchObject({
      registration: '2026001',
      classGroup: '9º ano A',
      birthDate: '2011-03-15',
      guardianName: null,
      password: '123456',
    });
    expect(input).not.toHaveProperty('subject');
  });

  it('userToForm formata telefone e data para exibição', () => {
    const user = {
      id: '1',
      name: 'Maria',
      email: 'maria@gmail.com',
      role: 'ALUNO',
      phone: '11912345678',
      birthDate: '2011-03-15T00:00:00.000Z',
      bio: null,
      subject: null,
      education: null,
      registration: null,
      classGroup: null,
      guardianName: null,
      createdAt: '',
      updatedAt: '',
    } satisfies User;
    expect(userToForm(user)).toMatchObject({ phone: '(11) 91234-5678', birthDate: '15/03/2011' });
  });
});
