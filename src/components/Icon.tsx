import Ionicons from '@expo/vector-icons/Ionicons';
import { SymbolView, type SFSymbol } from 'expo-symbols';
import { Platform, type ColorValue } from 'react-native';

const ICONS = {
  home: { sf: 'house', ion: 'home-outline' },
  homeFill: { sf: 'house.fill', ion: 'home' },
  manage: { sf: 'square.stack', ion: 'albums-outline' },
  manageFill: { sf: 'square.stack.fill', ion: 'albums' },
  teachers: { sf: 'graduationcap', ion: 'school-outline' },
  teachersFill: { sf: 'graduationcap.fill', ion: 'school' },
  students: { sf: 'person.2', ion: 'people-outline' },
  studentsFill: { sf: 'person.2.fill', ion: 'people' },
  profile: { sf: 'person.crop.circle', ion: 'person-circle-outline' },
  profileFill: { sf: 'person.crop.circle.fill', ion: 'person-circle' },
  plus: { sf: 'plus', ion: 'add' },
  ellipsis: { sf: 'ellipsis.circle', ion: 'ellipsis-horizontal-circle-outline' },
  chevron: { sf: 'chevron.right', ion: 'chevron-forward' },
  search: { sf: 'magnifyingglass', ion: 'search' },
  clear: { sf: 'xmark.circle.fill', ion: 'close-circle' },
  lock: { sf: 'lock.fill', ion: 'lock-closed' },
  eye: { sf: 'eye', ion: 'eye-outline' },
  eyeSlash: { sf: 'eye.slash', ion: 'eye-off-outline' },
  offline: { sf: 'wifi.exclamationmark', ion: 'cloud-offline-outline' },
  empty: { sf: 'tray', ion: 'file-tray-outline' },
  noResults: { sf: 'text.magnifyingglass', ion: 'search-outline' },
  comment: { sf: 'bubble.left', ion: 'chatbubble-outline' },
} as const satisfies Record<string, { sf: SFSymbol; ion: keyof typeof Ionicons.glyphMap }>;

export type IconName = keyof typeof ICONS;

interface Props {
  name: IconName;
  size?: number;
  color: ColorValue;
}

export function Icon({ name, size = 22, color }: Props) {
  const { sf, ion } = ICONS[name];
  const fallback = <Ionicons name={ion} size={size} color={color} />;
  if (Platform.OS !== 'ios') return fallback;
  return (
    <SymbolView
      name={sf}
      size={size}
      tintColor={color}
      weight="regular"
      resizeMode="scaleAspectFit"
      fallback={fallback}
      style={{ width: size, height: size }}
    />
  );
}
