import {
  brDateToIso,
  excerpt,
  formatDate,
  initials,
  isoToBrDate,
  maskDate,
  maskPhone,
  readingTime,
} from '@/utils/format';

describe('format utils', () => {
  it('excerpt corta textos longos e normaliza espaços', () => {
    expect(excerpt('a   b\n c', 100)).toBe('a b c');
    expect(excerpt('x'.repeat(200), 10)).toBe(`${'x'.repeat(10)}…`);
  });

  it('initials usa as duas primeiras palavras', () => {
    expect(initials('Felipe Andrade')).toBe('FA');
    expect(initials('Prof. Maria Silva')).toBe('MS');
  });

  it('formatDate aceita data completa ou apenas AAAA-MM-DD', () => {
    expect(formatDate('nao-e-data')).toBe('');
    expect(formatDate('2011-03-15')).toBe('15/03/2011');
    expect(formatDate('2011-03-15T00:00:00.000Z')).toBe('15/03/2011');
  });

  it('maskPhone formata fixo e celular', () => {
    expect(maskPhone('1134567890')).toBe('(11) 3456-7890');
    expect(maskPhone('11987654321')).toBe('(11) 98765-4321');
    expect(maskPhone('11987654321999')).toBe('(11) 98765-4321');
  });

  it('maskDate e conversões de data', () => {
    expect(maskDate('15032011')).toBe('15/03/2011');
    expect(brDateToIso('15/03/2011')).toBe('2011-03-15');
    expect(brDateToIso('31/02/2011')).toBeNull();
    expect(isoToBrDate('2011-03-15T00:00:00.000Z')).toBe('15/03/2011');
  });

  it('readingTime tem no mínimo 1 minuto', () => {
    expect(readingTime('texto curto')).toBe(1);
    expect(readingTime('palavra '.repeat(600))).toBe(3);
  });
});

describe('agenda (margem do caderno)', () => {
  it('dayParts devolve dia com dois dígitos e mês abreviado', () => {
    const { dayParts } = jest.requireActual('@/utils/format');
    expect(dayParts('2026-09-05T15:00:00.000Z')).toMatchObject({ day: '05', month: 'SET' });
  });

  it('monthLabel agrupa por mês com inicial maiúscula', () => {
    const { monthLabel } = jest.requireActual('@/utils/format');
    expect(monthLabel('2026-09-20T15:00:00.000Z')).toBe('Setembro de 2026');
  });
});
