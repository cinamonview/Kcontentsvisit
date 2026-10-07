// Small building blocks shared by the screens (think of them as reusable Flutter widgets).

import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View, type PressableProps, type ViewProps } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/** English name first with the Korean name alongside, or the reverse in Korean. */
export function useNames(item: { name_en: string; name_ko: string }) {
  const { i18n } = useTranslation();
  return i18n.language === 'ko'
    ? { primary: item.name_ko, secondary: item.name_en }
    : { primary: item.name_en, secondary: item.name_ko };
}

export function Card({ style, ...props }: ViewProps) {
  const theme = useTheme();
  return (
    <View
      style={[styles.card, { backgroundColor: theme.backgroundElement, borderColor: theme.border }, style]}
      {...props}
    />
  );
}

export function Chip({
  label,
  selected,
  ...props
}: PressableProps & { label: string; selected?: boolean }) {
  const theme = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={({ pressed }) => [
        styles.chip,
        { backgroundColor: selected ? theme.accent : theme.backgroundElement, opacity: pressed ? 0.7 : 1 },
      ]}
      {...props}>
      <ThemedText type="small" style={selected ? { color: theme.background } : undefined}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

export function Button({
  label,
  primary,
  ...props
}: PressableProps & { label: string; primary?: boolean }) {
  const theme = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.button,
        primary
          ? { backgroundColor: theme.accent }
          : { borderColor: theme.border, borderWidth: StyleSheet.hairlineWidth },
        { opacity: pressed ? 0.7 : 1 },
      ]}
      {...props}>
      <ThemedText type="smallBold" style={primary ? { color: theme.background } : undefined}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

export function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <ThemedText type="smallBold" themeColor="textSecondary">
        {title}
      </ThemedText>
      {children}
    </View>
  );
}

/** Required by PRD section 8: make clear this is not an official app. */
export function Disclaimer() {
  const { t } = useTranslation();
  return (
    <ThemedText type="small" themeColor="textSecondary" style={styles.disclaimer}>
      {t('disclaimer')}
    </ThemedText>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Spacing.three,
    borderWidth: StyleSheet.hairlineWidth,
    padding: Spacing.three,
    gap: Spacing.one,
  },
  chip: {
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.four,
  },
  button: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.two + Spacing.one,
    borderRadius: Spacing.three,
  },
  section: {
    gap: Spacing.one,
  },
  disclaimer: {
    textAlign: 'center',
    paddingVertical: Spacing.four,
  },
});
