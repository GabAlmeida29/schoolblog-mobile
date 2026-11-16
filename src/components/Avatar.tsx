import { View } from 'react-native';
import { AppText } from './AppText';
import { useTheme } from '@/theme/useTheme';
import { initials } from '@/utils/format';

export function Avatar({ name, size = 40 }: { name: string; size?: number }) {
  const { colors } = useTheme();
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no"
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: colors.tintSoft,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <AppText
        tone="tint"
        weight="600"
        allowFontScaling={false}
        style={{ fontSize: size * 0.38, lineHeight: size * 0.46 }}
      >
        {initials(name) || '?'}
      </AppText>
    </View>
  );
}
