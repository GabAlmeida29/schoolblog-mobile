export function excerpt(content: string, length = 140): string {
  const plain = content.replace(/\s+/g, ' ').trim();
  return plain.length > length ? `${plain.slice(0, length).trimEnd()}…` : plain;
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function initials(name: string): string {
  return name
    .replace(/^prof(a|\.)?\s+/i, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join('');
}
