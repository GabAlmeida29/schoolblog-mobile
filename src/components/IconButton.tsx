import { Pressable, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { colors, radius } from '@/theme/theme';

interface Props {
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  label: string;
  color?: string;
  background?: string;
  testID?: string;
}

/** Botão só com ícone. `label` vira accessibilityLabel (leitores de tela). */
export function IconButton({ icon, onPress, label, color = colors.primary, background = colors.primarySoft, testID }: Props) {
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={8}
      onPress={onPress}
      style={({ pressed }) => [styles.base, { backgroundColor: background }, pressed && { opacity: 0.7 }]}
    >
      <Ionicons name={icon} size={20} color={color} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { width: 40, height: 40, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center' },
});
