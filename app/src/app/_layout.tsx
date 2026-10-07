import '@/i18n';

import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { useColorScheme } from 'react-native';

import { TrailProvider } from '@/store/trail';

// Root navigator: the tabs, with content and spot screens pushed on top of them.
export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <TrailProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="content/[id]" options={{ title: '' }} />
          <Stack.Screen name="spot/[id]" options={{ title: '' }} />
        </Stack>
      </TrailProvider>
    </ThemeProvider>
  );
}
