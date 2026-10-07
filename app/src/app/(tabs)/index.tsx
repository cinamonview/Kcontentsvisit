// Explore tab (F-01): artists and shows by type, with search.

import { Link } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getContents, getSpots, type Content, type ContentType } from '@/api';
import { ThemedText } from '@/components/themed-text';
import { Card, Chip, Disclaimer, useNames } from '@/components/ui';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useApi } from '@/hooks/use-api';
import { useTheme } from '@/hooks/use-theme';

const TYPES: ContentType[] = ['KPOP', 'DRAMA', 'MOVIE'];

export default function ExploreScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const [type, setType] = useState<ContentType | undefined>();
  const [query, setQuery] = useState('');

  const { data: contents, error } = useApi(() => getContents({ type, q: query }), [type, query]);
  const { data: spots } = useApi(() => getSpots(), []);

  const countFor = (c: Content) => spots?.filter((s) => s.contents.some((x) => x.id === c.id)).length ?? 0;

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: theme.background }]} edges={['top']}>
      <FlatList
        contentContainerStyle={styles.list}
        data={contents ?? []}
        keyExtractor={(c) => String(c.id)}
        ListHeaderComponent={
          <View style={styles.header}>
            <ThemedText type="subtitle">{t('explore.title')}</ThemedText>
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder={t('explore.search')}
              placeholderTextColor={theme.textSecondary}
              style={[styles.search, { color: theme.text, backgroundColor: theme.backgroundElement }]}
              autoCorrect={false}
              clearButtonMode="while-editing"
            />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
              <Chip label={t('explore.all')} selected={!type} onPress={() => setType(undefined)} />
              {TYPES.map((ct) => (
                <Chip key={ct} label={t(`types.${ct}`)} selected={type === ct} onPress={() => setType(ct)} />
              ))}
            </ScrollView>
          </View>
        }
        ListEmptyComponent={
          <ThemedText themeColor="textSecondary">{error ? t('error') : t('explore.empty')}</ThemedText>
        }
        renderItem={({ item }) => <ContentRow content={item} spotCount={countFor(item)} />}
        ListFooterComponent={<Disclaimer />}
      />
    </SafeAreaView>
  );
}

function ContentRow({ content, spotCount }: { content: Content; spotCount: number }) {
  const { t } = useTranslation();
  const names = useNames(content);
  return (
    <Link href={`/content/${content.id}`} asChild>
      <Pressable style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
        <Card>
          <ThemedText type="small" themeColor="textSecondary">
            {t(`types.${content.type}`)}
          </ThemedText>
          <ThemedText type="default" style={styles.contentName}>
            {names.primary}
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {names.secondary} · {t('explore.spotCount', { count: spotCount })}
          </ThemedText>
        </Card>
      </Pressable>
    </Link>
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
  header: { gap: Spacing.three, marginBottom: Spacing.one },
  search: {
    borderRadius: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two + Spacing.one,
    fontSize: 16,
  },
  chips: { gap: Spacing.two },
  contentName: { fontSize: 20, fontWeight: 700 },
});
