import { loginSchema, postSchema, userSchema } from '@/schemas';

describe('schemas (validação dos formulários)', () => {
  it('login exige e-mail válido e senha', () => {
    expect(loginSchema.safeParse({ email: 'x', password: '' }).success).toBe(false);
    expect(loginSchema.safeParse({ email: 'prof@schoolblog.com', password: '123' }).success).toBe(true);
  });

  it('post segue as mesmas regras da API (título >= 3, autor >= 2)', () => {
    const invalid = postSchema.safeParse({ title: 'oi', content: '', author: 'A' });
    expect(invalid.success).toBe(false);
    if (!invalid.success) {
      const fields = invalid.error.issues.map((i) => i.path[0]);
      expect(fields).toEqual(expect.arrayContaining(['title', 'content', 'author']));
    }
    expect(postSchema.safeParse({ title: 'Frações', content: 'Aula', author: 'Prof' }).success).toBe(true);
  });

  it('usuário: senha obrigatória na criação e opcional na edição', () => {
    const base = { name: 'Maria', email: 'maria@schoolblog.com' };
    expect(userSchema(false).safeParse({ ...base, password: '' }).success).toBe(false);
    expect(userSchema(false).safeParse({ ...base, password: 'segredo1' }).success).toBe(true);
    expect(userSchema(true).safeParse({ ...base, password: '' }).success).toBe(true);
    expect(userSchema(true).safeParse({ ...base, password: '123' }).success).toBe(false);
  });
});
