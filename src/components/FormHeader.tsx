import { Stack, router } from 'expo-router';
import { HeaderButton } from './HeaderButton';
import { STRINGS } from '@/constants/strings';
import { confirmDestructive } from '@/utils/feedback';

interface Props {
  saveLabel?: string;
  canSave: boolean;
  saving: boolean;
  dirty: boolean;
  onSave: () => void;
}

export function FormHeader({ saveLabel = STRINGS.common.save, canSave, saving, dirty, onSave }: Props) {
  const cancel = () => {
    if (!dirty) return router.back();
    confirmDestructive(
      STRINGS.common.discardTitle,
      STRINGS.common.discardMessage,
      STRINGS.common.discard,
      () => router.back(),
    );
  };

  return (
    <Stack.Screen
      options={{
        gestureEnabled: !dirty,
        headerLeft: () => (
          <HeaderButton label={STRINGS.common.cancel} onPress={cancel} testID="form-cancel" />
        ),
        headerRight: () => (
          <HeaderButton
            label={saveLabel}
            primary
            disabled={!canSave}
            loading={saving}
            onPress={onSave}
            testID="form-save"
          />
        ),
      }}
    />
  );
}
