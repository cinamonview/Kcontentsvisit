// react-native-maps has no web version, so the web build shows the list instead.

import { useTranslation } from 'react-i18next';
import { FlatList, StyleSheet } from 'react-native';

import { getSpots } from '@/api';
import { SpotCard } from '@/components/spot-card';
import { ThemedText } from '@/components/themed-text';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useApi } from '@/hooks/use-api';

export default function MapScreen() {
  const { t } = useTranslation();
  const { data: spots } = useApi(() => getSpots(), []);
  return (
    <FlatList
      contentContainerStyle={styles.list}
      data={spots ?? []}
      keyExtractor={(s) => String(s.id)}
      ListHeaderComponent={<ThemedText themeColor="textSecondary">{t('map.webFallback')}</ThemedText>}
      renderItem={({ item }) => <SpotCard spot={item} />}
    />
  );
}

const styles = StyleSheet.create({
  list: { padding: Spacing.three, gap: Spacing.three, width: '100%', maxWidth: MaxContentWidth, alignSelf: 'center' },
});
