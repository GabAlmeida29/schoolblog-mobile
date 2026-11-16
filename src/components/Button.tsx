import { ActivityIndicator, Pressable, StyleSheet, type ViewStyle } from 'react-native';
import { AppText } from './AppText';
import { radius, spacing } from '@/theme/theme';
import { makeStyles, useTheme } from '@/theme/useTheme';

interface Props {
  title: string;
  onPress: () => void;
  variant?: 'filled' | 'plain';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  testID?: string;
}

export function Button({ title, onPress, variant = 'filled', loading, disabled, style, testID }: Props) {
  const styles = useStyles();
  const { colors } = useTheme();
  const isDisabled = !!disabled || !!loading;
  const filled = variant === 'filled';

  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: isDisabled, busy: !!loading }}
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        filled && { backgroundColor: pressed ? colors.tintPressed : colors.tint },
        filled && isDisabled && { backgroundColor: colors.fill },
        !filled && pressed && { opacity: 0.5 },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={filled ? colors.onTint : colors.tint} />
      ) : (
        <AppText
          variant="headline"
          tone={filled ? (isDisabled ? 'tertiary' : 'onTint') : isDisabled ? 'tertiary' : 'tint'}
        >
          {title}
        </AppText>
      )}
    </Pressable>
  );
}

const useStyles = makeStyles(() =>
  StyleSheet.create({
    base: {
      minHeight: 50,
      borderRadius: radius.cell,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: spacing.xl,
    },
  }),
);
