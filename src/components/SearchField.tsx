import { Platform, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { Icon } from './Icon';
import { STRINGS } from '@/constants/strings';
import { radius, spacing, textStyles } from '@/theme/theme';
import { makeStyles, useTheme } from '@/theme/useTheme';

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  testID?: string;
}

export function SearchField({ value, onChangeText, placeholder, testID = 'search-input' }: Props) {
  const styles = useStyles();
  const { colors } = useTheme();
  return (
    <View style={styles.field}>
      <Icon name="search" size={16} color={colors.secondary} />
      <TextInput
        testID={testID}
        accessibilityLabel={placeholder}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.secondary}
        selectionColor={colors.tint}
        returnKeyType="search"
        autoCorrect={false}
        clearButtonMode="never"
        style={styles.input}
      />
      {value.length > 0 && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={STRINGS.home.clearSearch}
          hitSlop={10}
          onPress={() => onChangeText('')}
        >
          <Icon name="clear" size={16} color={colors.tertiary} />
        </Pressable>
      )}
    </View>
  );
}

const useStyles = makeStyles((colors) =>
  StyleSheet.create({
    field: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm - 2,
      backgroundColor: colors.fill,
      borderRadius: radius.control,
      paddingHorizontal: spacing.sm,
      minHeight: 38,
    },
    input: {
      ...textStyles.body,
      flex: 1,
      color: colors.label,
      paddingVertical: 6,
      ...(Platform.OS === 'web' ? { outlineWidth: 0 } : null),
    },
  }),
);
