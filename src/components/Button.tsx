import { ActivityIndicator, Pressable, StyleSheet, Text, type ViewStyle } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { colors, radius, spacing } from '@/theme/theme';

type Variant = 'primary' | 'outline' | 'danger' | 'ghost';

interface Props {
  title: string;
  onPress: () => void;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  style?: ViewStyle;
  testID?: string;
}

export function Button({ title, onPress, variant = 'primary', loading, disabled, icon, style, testID }: Props) {
  const isDisabled = disabled || loading;
  const fg = variant === 'primary' || variant === 'danger' ? colors.white : variant === 'outline' ? colors.primary : colors.text;

  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!isDisabled, busy: !!loading }}
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        pressed && { opacity: 0.85 },
        isDisabled && { opacity: 0.55 },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={fg} />
      ) : (
        <>
          {icon && <Ionicons name={icon} size={18} color={fg} />}
          <Text style={[styles.label, { color: fg }]}>{title}</Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 48,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  primary: { backgroundColor: colors.primary },
  danger: { backgroundColor: colors.danger },
  outline: { borderWidth: 1.5, borderColor: colors.primary, backgroundColor: colors.surface },
  ghost: { backgroundColor: 'transparent' },
  label: { fontSize: 16, fontWeight: '600' },
});
