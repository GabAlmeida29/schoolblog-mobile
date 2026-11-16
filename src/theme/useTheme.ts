import { useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { dark, light, type Palette } from './colors';

export function useTheme(): { colors: Palette; isDark: boolean } {
  const isDark = useColorScheme() === 'dark';
  return { colors: isDark ? dark : light, isDark };
}

export function makeStyles<T>(factory: (colors: Palette) => T) {
  return function useStyles(): T {
    const { colors } = useTheme();
    return useMemo(() => factory(colors), [colors]);
  };
}
