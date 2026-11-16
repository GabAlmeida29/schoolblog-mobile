import { ActivityIndicator, Pressable, StyleSheet } from 'react-native';
import { AppText } from './AppText';
import { Icon, type IconName } from './Icon';
import { useTheme } from '@/theme/useTheme';

interface Props {
  label: string;
  onPress: () => void;
  icon?: IconName;
  primary?: boolean;
  disabled?: boolean;
  loading?: boolean;
  testID?: string;
}

export function HeaderButton({ label, onPress, icon, primary, disabled, loading, testID }: Props) {
  const { colors } = useTheme();
  if (loading) return <ActivityIndicator color={colors.tint} style={styles.target} />;
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      hitSlop={8}
      onPress={onPress}
      style={({ pressed }) => [styles.target, pressed && { opacity: 0.4 }]}
    >
      {icon ? (
        <Icon name={icon} size={22} color={disabled ? colors.tertiary : colors.tint} />
      ) : (
        <AppText
          variant="body"
          tone={disabled ? 'tertiary' : 'tint'}
          weight={primary ? '600' : '400'}
        >
          {label}
        </AppText>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  target: { minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center' },
});
