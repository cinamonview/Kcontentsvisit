// My Trail tab: stamp progress (F-06) and saved spots (F-07).

import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getSpots } from '@/api';
import { SpotCard } from '@/components/spot-card';
import { ThemedText } from '@/components/themed-text';
import { Disclaimer, Section } from '@/components/ui';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useApi } from '@/hooks/use-api';
import { useTheme } from '@/hooks/use-theme';
import { useTrail } from '@/store/trail';

export default function TrailScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const { saved, visited } = useTrail();
  const { data: spots } = useApi(() => getSpots(), []);
  const all = spots ?? [];
  const savedSpots = all.filter((s) => saved.has(s.id));
  const visitedSpots = all.filter((s) => visited.has(s.id));
  const ratio = all.length ? visitedSpots.length / all.length : 0;

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: theme.background }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.body}>
        <View style={styles.progress}>
          <ThemedText type="subtitle">{t('trail.progress', { visited: visitedSpots.length, total: all.length })}</ThemedText>
          <View style={[styles.bar, { backgroundColor: theme.backgroundElement }]}>
            <View style={[styles.fill, { width: `${ratio * 100}%`, backgroundColor: theme.accent }]} />
          </View>
        </View>

        <Section title={t('trail.visited')}>
          {visitedSpots.length ? (
            visitedSpots.map((s) => <SpotCard key={s.id} spot={s} />)
          ) : (
            <ThemedText type="small" themeColor="textSecondary">
              {t('trail.emptyVisited')}
            </ThemedText>
          )}
        </Section>

        <Section title={t('trail.saved')}>
          {savedSpots.length ? (
            savedSpots.map((s) => <SpotCard key={s.id} spot={s} />)
          ) : (
            <ThemedText type="small" themeColor="textSecondary">
              {t('trail.emptySaved')}
            </ThemedText>
          )}
        </Section>

        <Disclaimer />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  body: {
    padding: Spacing.three,
    gap: Spacing.four,
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
  },
  progress: { gap: Spacing.two },
  bar: { height: 10, borderRadius: 5, overflow: 'hidden' },
  fill: { height: '100%' },
});
