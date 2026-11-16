import { Text, type TextProps } from 'react-native';
import { textStyles, type TextVariant } from '@/theme/theme';
import { useTheme } from '@/theme/useTheme';

type Tone = 'label' | 'secondary' | 'tertiary' | 'tint' | 'destructive' | 'onTint' | 'success' | 'warning';

interface Props extends TextProps {
  variant?: TextVariant;
  tone?: Tone;
  weight?: '400' | '500' | '600' | '700';
}

export function AppText({ variant = 'body', tone = 'label', weight, style, ...props }: Props) {
  const { colors } = useTheme();
  const color = {
    label: colors.label,
    secondary: colors.secondary,
    tertiary: colors.tertiary,
    tint: colors.tint,
    destructive: colors.destructive,
    onTint: colors.onTint,
    success: colors.success,
    warning: colors.warning,
  }[tone];
  return (
    <Text
      {...props}
      style={[textStyles[variant], { color }, weight ? { fontWeight: weight } : null, style]}
    />
  );
}
