import { DarkTheme, DefaultTheme, type Theme } from 'expo-router';
import { dark, light } from './colors';

function build(base: Theme, palette: typeof light): Theme {
  return {
    ...base,
    colors: {
      ...base.colors,
      primary: palette.tint,
      background: palette.ground,
      card: palette.surface,
      text: palette.label,
      border: palette.separator,
      notification: palette.destructive,
    },
  };
}

export const navigationLight = build(DefaultTheme, light);
export const navigationDark = build(DarkTheme, dark);
