export function excerpt(content: string, length = 120): string {
  const plain = content.replace(/\s+/g, ' ').trim();
  return plain.length > length ? `${plain.slice(0, length).trimEnd()}…` : plain;
}

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return '';
  if (/^\d{4}-\d{2}-\d{2}(T00:00:00(\.000)?Z)?$/.test(iso)) return isoToBrDate(iso);
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function monthLabel(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  const label = date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export function dayParts(iso: string): { day: string; month: string; weekday: string } {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return { day: '', month: '', weekday: '' };
  const clean = (value: string) => value.replace('.', '').toUpperCase();
  return {
    day: String(date.getDate()).padStart(2, '0'),
    month: clean(date.toLocaleDateString('pt-BR', { month: 'short' })),
    weekday: clean(date.toLocaleDateString('pt-BR', { weekday: 'short' })),
  };
}

export function isRecent(iso: string, days = 7, now = new Date()): boolean {
  const date = new Date(iso);
  return !Number.isNaN(date.getTime()) && now.getTime() - date.getTime() < days * 86_400_000;
}

export function formatLongDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function readingTime(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export function initials(name: string): string {
  return name
    .replace(/^prof(a|\.)?\s+/i, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join('');
}

export function firstName(name: string): string {
  return name.trim().split(/\s+/)[0] ?? name;
}


export function onlyDigits(value: string): string {
  return value.replace(/\D/g, '');
}

export function maskPhone(value: string): string {
  const digits = onlyDigits(value).slice(0, 11);
  if (digits.length <= 2) return digits.length ? `(${digits}` : '';
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10)
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export function maskDate(value: string): string {
  const digits = onlyDigits(value).slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

export function brDateToIso(value: string): string | null {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
  if (!match) return null;
  const [, day, month, year] = match;
  const iso = `${year}-${month}-${day}`;
  const date = new Date(`${iso}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime()) || !date.toISOString().startsWith(iso)) return null;
  if (date > new Date() || Number(year) < 1900) return null;
  return iso;
}

export function isoToBrDate(iso: string | null | undefined): string {
  if (!iso) return '';
  const [year, month, day] = iso.slice(0, 10).split('-');
  return year && month && day ? `${day}/${month}/${year}` : '';
}
