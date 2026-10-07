// Map tab (F-04): spot markers with a content filter. Tapping a marker's
// callout opens the spot detail.

import { router } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, View } from 'react-native';
import MapView, { Callout, Marker } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getContents, getSpots } from '@/api';
import { ThemedText } from '@/components/themed-text';
import { Chip, useNames } from '@/components/ui';
import { Spacing } from '@/constants/theme';
import { useApi } from '@/hooks/use-api';
import { useTheme } from '@/hooks/use-theme';
import type { SpotSummary } from '@/api';

// Seoul, zoomed out enough to include the near-Seoul spots.
const INITIAL_REGION = { latitude: 37.57, longitude: 126.98, latitudeDelta: 0.35, longitudeDelta: 0.35 };

export default function MapScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const [contentId, setContentId] = useState<number | undefined>();
  const { data: contents } = useApi(() => getContents(), []);
  const { data: spots } = useApi(() => getSpots(), []);

  const visible = (spots ?? []).filter((s) => !contentId || s.contents.some((c) => c.id === contentId));

  return (
    <View style={styles.screen}>
      <MapView style={StyleSheet.absoluteFill} initialRegion={INITIAL_REGION}>
        {visible.map((spot) => (
          <SpotMarker key={spot.id} spot={spot} color={theme.accent} />
        ))}
      </MapView>
      <SafeAreaView edges={['top']} pointerEvents="box-none">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          <Chip label={t('map.allContents')} selected={!contentId} onPress={() => setContentId(undefined)} />
          {(contents ?? []).map((c) => (
            <Chip key={c.id} label={c.name_en} selected={contentId === c.id} onPress={() => setContentId(c.id)} />
          ))}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function SpotMarker({ spot, color }: { spot: SpotSummary; color: string }) {
  const names = useNames(spot);
  return (
    <Marker coordinate={{ latitude: spot.latitude, longitude: spot.longitude }} pinColor={color}>
      <Callout onPress={() => router.push(`/spot/${spot.id}`)}>
        <View style={styles.callout}>
          <ThemedText type="smallBold" style={styles.calloutText}>
            {names.primary}
          </ThemedText>
          <ThemedText type="small" style={styles.calloutText}>
            {spot.contents.map((c) => c.name_en).join(', ')}
          </ThemedText>
        </View>
      </Callout>
    </Marker>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  chips: { gap: Spacing.two, padding: Spacing.three },
  callout: { maxWidth: 220, padding: Spacing.one },
  // Callouts are always light, so keep the text dark in dark mode too.
  calloutText: { color: '#000000' },
});
