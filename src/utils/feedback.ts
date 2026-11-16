import * as Haptics from 'expo-haptics';
import { ActionSheetIOS, Alert, Platform } from 'react-native';
import { STRINGS } from '@/constants/strings';

export interface SheetAction {
  label: string;
  onPress: () => void;
  destructive?: boolean;
}

export function showActions(title: string, actions: SheetAction[]) {
  if (Platform.OS === 'ios') {
    const destructiveIndex = actions.findIndex((action) => action.destructive);
    ActionSheetIOS.showActionSheetWithOptions(
      {
        title,
        options: [...actions.map((action) => action.label), STRINGS.common.cancel],
        cancelButtonIndex: actions.length,
        destructiveButtonIndex: destructiveIndex >= 0 ? destructiveIndex : undefined,
      },
      (index) => actions[index]?.onPress(),
    );
    return;
  }
  if (Platform.OS === 'web') {
    const chosen = actions.find((action) => globalThis.confirm?.(`${title}\n\n${action.label}?`));
    chosen?.onPress();
    return;
  }
  Alert.alert(title, undefined, [
    ...actions.map((action) => ({
      text: action.label,
      style: action.destructive ? ('destructive' as const) : ('default' as const),
      onPress: action.onPress,
    })),
    { text: STRINGS.common.cancel, style: 'cancel' as const },
  ]);
}

export function confirmDestructive(
  title: string,
  message: string,
  confirmLabel: string,
  onConfirm: () => void,
) {
  if (Platform.OS === 'web') {
    if (globalThis.confirm?.(`${title}\n\n${message}`)) onConfirm();
    return;
  }
  Alert.alert(title, message, [
    { text: STRINGS.common.cancel, style: 'cancel' },
    { text: confirmLabel, style: 'destructive', onPress: onConfirm },
  ]);
}

export function showError(error: unknown) {
  const message = error instanceof Error ? error.message : STRINGS.errors.unexpected;
  hapticError();
  if (Platform.OS === 'web') {
    globalThis.alert?.(`${STRINGS.common.errorTitle}\n\n${message}`);
    return;
  }
  Alert.alert(STRINGS.common.errorTitle, message);
}

export function hapticSuccess() {
  if (Platform.OS === 'web') return;
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
}

export function hapticError() {
  if (Platform.OS === 'web') return;
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => undefined);
}

export function hapticTap() {
  if (Platform.OS === 'web') return;
  Haptics.selectionAsync().catch(() => undefined);
}
