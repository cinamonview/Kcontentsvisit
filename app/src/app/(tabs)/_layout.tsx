import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { useTranslation } from 'react-i18next';

import { useTheme } from '@/hooks/use-theme';

// Bottom tabs from PRD section 7: Explore / Map / My Trail.
export default function TabLayout() {
  const { t } = useTranslation();
  const colors = useTheme();

  return (
    <NativeTabs
      backgroundColor={colors.background}
      indicatorColor={colors.backgroundElement}
      labelStyle={{ selected: { color: colors.text } }}>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>{t('tabs.explore')}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="sparkle.magnifyingglass" md="travel_explore" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="map">
        <NativeTabs.Trigger.Label>{t('tabs.map')}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="map" md="map" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="trail">
        <NativeTabs.Trigger.Label>{t('tabs.trail')}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="checkmark.seal" md="verified" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
