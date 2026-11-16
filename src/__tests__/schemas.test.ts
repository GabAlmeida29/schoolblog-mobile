import { loginSchema, postSchema, profileSchema, userFormSchema } from '@/schemas';
import { emptyUserForm } from '@/utils/userMapper';

describe('schemas', () => {
  it('login exige e-mail válido e senha', () => {
    expect(loginSchema.safeParse({ email: 'x', password: '' }).success).toBe(false);
    expect(loginSchema.safeParse({ email: 'felipe@gmail.com', password: '123456' }).success).toBe(
      true,
    );
  });

  it('post exige título (>= 3) e conteúdo, sem campo de autor', () => {
    const invalid = postSchema.safeParse({ title: 'oi', content: '' });
    expect(invalid.success).toBe(false);
    const parsed = postSchema.parse({ title: 'Frações', content: 'Aula', author: 'Ignorado' });
    expect(parsed).toEqual({ title: 'Frações', content: 'Aula' });
  });

  it('usuário: senha obrigatória só na criação', () => {
    const base = { ...emptyUserForm, name: 'Maria', email: 'maria@gmail.com' };
    expect(userFormSchema(false).safeParse(base).success).toBe(false);
    expect(userFormSchema(false).safeParse({ ...base, password: '123456' }).success).toBe(true);
    expect(userFormSchema(true).safeParse(base).success).toBe(true);
    expect(userFormSchema(true).safeParse({ ...base, password: '123' }).success).toBe(false);
  });

  it('usuário: valida telefone e data de nascimento quando preenchidos', () => {
    const base = { ...emptyUserForm, name: 'Maria', email: 'maria@gmail.com' };
    const schema = userFormSchema(true);
    expect(schema.safeParse({ ...base, phone: '(11) 9123' }).success).toBe(false);
    expect(schema.safeParse({ ...base, phone: '(11) 91234-5678' }).success).toBe(true);
    expect(schema.safeParse({ ...base, birthDate: '31/02/2012' }).success).toBe(false);
    expect(schema.safeParse({ ...base, birthDate: '15/03/2011' }).success).toBe(true);
  });

  it('perfil: confirmação e senha atual obrigatórias ao trocar a senha', () => {
    const base = { name: 'Felipe', phone: '', currentPassword: '', newPassword: '', confirmPassword: '' };
    expect(profileSchema.safeParse(base).success).toBe(true);
    expect(
      profileSchema.safeParse({ ...base, newPassword: '654321', confirmPassword: '000000' }).success,
    ).toBe(false);
    expect(
      profileSchema.safeParse({ ...base, newPassword: '654321', confirmPassword: '654321' }).success,
    ).toBe(false);
    expect(
      profileSchema.safeParse({
        ...base,
        currentPassword: '123456',
        newPassword: '654321',
        confirmPassword: '654321',
      }).success,
    ).toBe(true);
  });
});
