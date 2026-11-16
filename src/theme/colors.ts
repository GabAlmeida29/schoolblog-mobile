export interface Palette {
  tint: string;
  tintPressed: string;
  tintSoft: string;
  onTint: string;
  margin: string;
  rule: string;
  ground: string;
  surface: string;
  surfaceRaised: string;
  fill: string;
  label: string;
  secondary: string;
  tertiary: string;
  separator: string;
  destructive: string;
  success: string;
  warning: string;
}

export const light: Palette = {
  tint: '#2340B5',
  tintPressed: '#1A318C',
  tintSoft: '#E6EBFA',
  onTint: '#FFFFFF',
  margin: '#E25A47',
  rule: '#D3DEF0',
  ground: '#EEF1F6',
  surface: '#FFFFFF',
  surfaceRaised: '#FFFFFF',
  fill: 'rgba(118, 118, 128, 0.12)',
  label: '#111522',
  secondary: '#5B6274',
  tertiary: '#8C93A3',
  separator: '#D5DAE3',
  destructive: '#D83A2E',
  success: '#1F8A4C',
  warning: '#B26B00',
};

export const dark: Palette = {
  tint: '#8DA2FF',
  tintPressed: '#B3C0FF',
  tintSoft: '#1D2650',
  onTint: '#0B1024',
  margin: '#F0806F',
  rule: '#26304A',
  ground: '#0B0F1A',
  surface: '#161B29',
  surfaceRaised: '#1F2536',
  fill: 'rgba(118, 118, 128, 0.24)',
  label: '#EEF1F8',
  secondary: '#A3AABB',
  tertiary: '#737A8C',
  separator: '#2A3143',
  destructive: '#FF6B5E',
  success: '#4CC38A',
  warning: '#F2A93B',
};
