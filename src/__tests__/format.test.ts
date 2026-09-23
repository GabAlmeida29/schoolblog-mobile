import { excerpt, formatDate, initials } from '@/utils/format';

describe('format utils', () => {
  it('excerpt corta textos longos e normaliza espaços', () => {
    expect(excerpt('a   b\n c', 100)).toBe('a b c');
    expect(excerpt('x'.repeat(200), 10)).toBe(`${'x'.repeat(10)}…`);
  });

  it('initials ignora o prefixo "Prof."', () => {
    expect(initials('Prof. Maria Silva')).toBe('MS');
    expect(initials('lucas')).toBe('L');
  });

  it('formatDate retorna vazio para data inválida', () => {
    expect(formatDate('nao-e-data')).toBe('');
    expect(formatDate('2026-09-20T12:00:00.000Z')).toMatch(/20\/09\/2026/);
  });
});
