import { Children, Fragment, isValidElement, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText } from './AppText';
import { hairline, radius, spacing } from '@/theme/theme';
import { makeStyles } from '@/theme/useTheme';

interface Props {
  header?: string;
  footer?: string;
  children: ReactNode;
  inset?: number;
}

export function Group({ header, footer, children, inset = spacing.lg }: Props) {
  const styles = useStyles();
  const items = Children.toArray(children).filter(isValidElement);

  return (
    <View style={styles.wrapper}>
      {header && (
        <AppText variant="footnote" tone="secondary" style={styles.header}>
          {header}
        </AppText>
      )}
      <View style={styles.card}>
        {items.map((child, index) => (
          <Fragment key={child.key ?? index}>
            {index > 0 && <View style={[styles.separator, { marginLeft: inset }]} />}
            {child}
          </Fragment>
        ))}
      </View>
      {footer && (
        <AppText variant="footnote" tone="secondary" style={styles.footer}>
          {footer}
        </AppText>
      )}
    </View>
  );
}

const useStyles = makeStyles((colors) =>
  StyleSheet.create({
    wrapper: { marginHorizontal: spacing.lg, marginBottom: spacing.xxl },
    header: { marginLeft: spacing.lg, marginBottom: spacing.sm - 2 },
    footer: { marginHorizontal: spacing.lg, marginTop: spacing.sm - 2 },
    card: { backgroundColor: colors.surface, borderRadius: radius.cell, overflow: 'hidden' },
    separator: { height: hairline, backgroundColor: colors.separator },
  }),
);
