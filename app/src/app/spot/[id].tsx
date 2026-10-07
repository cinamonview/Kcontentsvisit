// Spot detail (F-03): why it's a spot and the source, tips, manners, safety and
// access (F-10, F-15, F-16), directions (F-05), official links (F-19), save and visit (F-06, F-07).

import { Stack, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { getSpot, type SpotDetail } from '@/api';
import { ThemedText } from '@/components/themed-text';
import { Button, Card, Disclaimer, Section, useNames } from '@/components/ui';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useApi } from '@/hooks/use-api';
import { useTheme } from '@/hooks/use-theme';
import { openGoogleMaps, openNaverMap, openUrl, withStartTime } from '@/lib/links';
import { useTrail } from '@/store/trail';

export default function SpotScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const spotId = Number(id);
  const { t } = useTranslation();
  const theme = useTheme();
  const { data: spot, loading } = useApi(() => getSpot(spotId), [spotId]);

  if (!spot) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        {!loading && <ThemedText themeColor="textSecondary">{t('spot.notFound')}</ThemedText>}
      </View>
    );
  }
  return <SpotBody spot={spot} />;
}

function SpotBody({ spot }: { spot: SpotDetail }) {
  const { t } = useTranslation();
  const theme = useTheme();
  const names = useNames(spot);
  const { saved, visited, toggleSaved, toggleVisited } = useTrail();
  const isSaved = saved.has(spot.id);
  const isVisited = visited.has(spot.id);

  return (
    <ScrollView style={{ backgroundColor: theme.background }} contentContainerStyle={styles.body}>
      <Stack.Screen options={{ title: names.primary }} />

      <View style={styles.titleBlock}>
        <ThemedText style={styles.title}>{names.primary}</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {names.secondary} · {spot.district} · {t(`spotType.${spot.spot_type}`)}
        </ThemedText>
      </View>

      <View style={styles.row}>
        <Button
          label={isVisited ? `✓ ${t('spot.visited')}` : t('spot.markVisited')}
          primary={!isVisited}
          onPress={() => toggleVisited(spot.id)}
        />
        <Button
          label={isSaved ? `★ ${t('spot.saved')}` : `☆ ${t('spot.save')}`}
          onPress={() => toggleSaved(spot.id)}
        />
      </View>

      <Section title={t('spot.related')}>
        {spot.relations.map((r) => (
          <Card key={r.id}>
            <ThemedText type="smallBold">{r.content.name_en}</ThemedText>
            <ThemedText type="small">{r.relation_note}</ThemedText>
            {r.media && (
              <Pressable onPress={() => openUrl(withStartTime(r.media!.url, r.scene_start_sec))}>
                <ThemedText type="linkPrimary">
                  ▶ {r.media.title} ({r.media.channel_name})
                </ThemedText>
              </Pressable>
            )}
            <Pressable onPress={() => openUrl(r.source_url)}>
              <ThemedText type="linkPrimary">
                {t('spot.source')}: {hostname(r.source_url)}
              </ThemedText>
            </Pressable>
          </Card>
        ))}
      </Section>

      <Section title={t('spot.access')}>
        <ThemedText type="small">
          {t(`access.${spot.access_level}`)}
          {spot.subway ? ` · ${spot.subway}` : ''}
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {spot.address}
        </ThemedText>
        {spot.access_note && <ThemedText type="small">{spot.access_note}</ThemedText>}
        {spot.timetable_url && (
          <Pressable onPress={() => openUrl(spot.timetable_url!)}>
            <ThemedText type="linkPrimary">{t('spot.timetable')}</ThemedText>
          </Pressable>
        )}
        <View style={styles.row}>
          <Button label={t('spot.googleMaps')} onPress={() => openGoogleMaps(spot)} />
          <Button label={t('spot.naverMap')} onPress={() => openNaverMap(spot)} />
        </View>
        {!spot.coord_verified && (
          <ThemedText type="small" style={{ color: theme.warning }}>
            {t('spot.coordUnverified')}
          </ThemedText>
        )}
      </Section>

      {spot.opening_hours && <Info title={t('spot.hours')} text={spot.opening_hours} />}
      {spot.admission && <Info title={t('spot.admission')} text={spot.admission} />}
      {spot.photo_tip && <Info title={t('spot.photoTip')} text={spot.photo_tip} />}
      {spot.manners && <Info title={t('spot.manners')} text={spot.manners} />}
      {spot.safety_note && <Info title={t('spot.safety')} text={spot.safety_note} warning />}

      <ThemedText type="small" themeColor="textSecondary">
        {t('spot.checkBeforeVisit')}
      </ThemedText>
      <Disclaimer />
    </ScrollView>
  );
}

// React Native's URL support is partial, so read the host with a regex.
function hostname(url: string) {
  return url.match(/^https?:\/\/([^/]+)/)?.[1]?.replace(/^www\./, '') ?? url;
}

function Info({ title, text, warning }: { title: string; text: string; warning?: boolean }) {
  const theme = useTheme();
  return (
    <Section title={title}>
      <ThemedText type="small" style={warning ? { color: theme.warning } : undefined}>
        {text}
      </ThemedText>
    </Section>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  body: {
    padding: Spacing.three,
    gap: Spacing.four,
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
  },
  titleBlock: { gap: Spacing.one },
  title: { fontSize: 28, lineHeight: 34, fontWeight: 700 },
  row: { flexDirection: 'row', gap: Spacing.two },
});
