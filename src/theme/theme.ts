// Mesma identidade visual do front web (Fase 03): indigo + pink, cantos arredondados.
export const colors = {
  primary: '#6366F1',
  primaryDark: '#4F46E5',
  primarySoft: '#EEF2FF',
  secondary: '#EC4899',
  background: '#F5F6FB',
  surface: '#FFFFFF',
  text: '#111827',
  textMuted: '#6B7280',
  border: '#E5E7EB',
  danger: '#DC2626',
  dangerSoft: '#FEE2E2',
  success: '#16A34A',
  white: '#FFFFFF',
};

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 };

export const radius = { sm: 8, md: 14, lg: 16, pill: 999 };

export const typography = {
  title: { fontSize: 22, fontWeight: '700' as const, color: colors.text },
  subtitle: { fontSize: 17, fontWeight: '700' as const, color: colors.text },
  body: { fontSize: 15, color: colors.text, lineHeight: 22 },
  caption: { fontSize: 13, color: colors.textMuted },
};

export const shadow = {
  shadowColor: '#000',
  shadowOpacity: 0.06,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 2 },
  elevation: 2,
};
