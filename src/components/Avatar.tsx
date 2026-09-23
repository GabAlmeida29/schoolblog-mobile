import { StyleSheet, Text, View } from 'react-native';
import { colors } from '@/theme/theme';
import { initials } from '@/utils/format';

const palette = ['#6366F1', '#EC4899', '#0EA5E9', '#10B981', '#F59E0B', '#8B5CF6'];

export function Avatar({ name, size = 40 }: { name: string; size?: number }) {
  const bg = palette[[...name].reduce((acc, c) => acc + c.charCodeAt(0), 0) % palette.length];
  return (
    <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2, backgroundColor: bg }]}>
      <Text style={[styles.text, { fontSize: size * 0.38 }]}>{initials(name) || '?'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: { alignItems: 'center', justifyContent: 'center' },
  text: { color: colors.white, fontWeight: '700' },
});
