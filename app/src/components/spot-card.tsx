import { Link } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';

import type { SpotSummary } from '@/api';
import { ThemedText } from '@/components/themed-text';
import { Card, useNames } from '@/components/ui';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useTrail } from '@/store/trail';

/** F-02: one spot in a list. Tapping opens the spot detail. */
export function SpotCard({ spot }: { spot: SpotSummary }) {
  const { t } = useTranslation();
  const theme = useTheme();
  const { saved, visited } = useTrail();
  const names = useNames(spot);

  const tags = [
    t(`spotType.${spot.spot_type}`),
    t(`access.${spot.access_level}`),
    ...(visited.has(spot.id) ? [`✓ ${t('spot.visited')}`] : []),
    ...(saved.has(spot.id) ? [`★ ${t('spot.saved')}`] : []),
  ];

  return (
    <Link href={`/spot/${spot.id}`} asChild>
      <Pressable style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
        <Card>
          <ThemedText type="default">{names.primary}</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {names.secondary} · {spot.district}
          </ThemedText>
          <View style={styles.tags}>
            {tags.map((tag) => (
              <ThemedText
                key={tag}
                type="small"
                style={[
                  styles.tag,
                  { color: spot.spot_type === 'EXCURSION' && tag === tags[0] ? theme.warning : theme.accent },
                ]}>
                {tag}
              </ThemedText>
            ))}
          </View>
        </Card>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
    marginTop: Spacing.one,
  },
  tag: {
    fontSize: 12,
  },
});
