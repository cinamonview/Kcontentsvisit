// Content detail (F-02): the spots for one artist or show.

import { Stack, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { FlatList, StyleSheet, View } from 'react-native';

import { getContent, getContentSpots } from '@/api';
import { SpotCard } from '@/components/spot-card';
import { ThemedText } from '@/components/themed-text';
import { Disclaimer, useNames } from '@/components/ui';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useApi } from '@/hooks/use-api';
import { useTheme } from '@/hooks/use-theme';

export default function ContentScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const contentId = Number(id);
  const { data: content } = useApi(() => getContent(contentId), [contentId]);
  const { data: spots } = useApi(() => getContentSpots(contentId), [contentId]);
  const theme = useTheme();

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      {content && <Header content={content} />}
      <FlatList
        contentContainerStyle={styles.list}
        data={spots ?? []}
        keyExtractor={(s) => String(s.id)}
        ListHeaderComponent={content ? <Intro description={content.description} count={spots?.length ?? 0} /> : null}
        renderItem={({ item }) => <SpotCard spot={item} />}
        ListFooterComponent={<Disclaimer />}
      />
    </View>
  );
}

function Header({ content }: { content: { name_en: string; name_ko: string } }) {
  const names = useNames(content);
  return <Stack.Screen options={{ title: names.primary }} />;
}

function Intro({ description, count }: { description: string; count: number }) {
  const { t } = useTranslation();
  return (
    <View style={styles.intro}>
      <ThemedText type="small" themeColor="textSecondary">
        {description}
      </ThemedText>
      <ThemedText type="smallBold">
        {t('content.spots')} · {t('explore.spotCount', { count })}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  list: {
    padding: Spacing.three,
    gap: Spacing.three,
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
  },
  intro: { gap: Spacing.two },
});
