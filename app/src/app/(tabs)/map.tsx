// Map tab (F-04): spot markers with a content filter. Tapping a marker's
// popup opens the spot detail.
//
// The map is a Leaflet page with OpenStreetMap tiles inside a WebView. The Google
// Maps key built into Expo Go is rejected, so react-native-maps draws nothing there.
// Free OSM tiles are for development/testing only. Before release, switch back to
// react-native-maps with your own Google key, or use a paid tile provider.

import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView, type WebViewMessageEvent } from 'react-native-webview';

import { getContents, getSpots } from '@/api';
import { Chip } from '@/components/ui';
import { Spacing } from '@/constants/theme';
import { useApi } from '@/hooks/use-api';

const MAP_HTML = `<!doctype html>
<html><head>
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css">
<style>html,body,#map{height:100%;margin:0}.pop b{display:block}.pop a{color:#3c2fd6;font-weight:600}</style>
</head><body><div id="map"></div>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script>
var map = L.map('map', {zoomControl: false}).setView([37.57, 126.98], 11);
L.control.zoom({position: 'bottomright'}).addTo(map);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19, attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);
var layer = L.layerGroup().addTo(map);
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function setSpots(spots, detailLabel){
  layer.clearLayers();
  spots.forEach(function(s){
    var m = L.marker([s.lat, s.lng]).addTo(layer);
    m.bindPopup('<div class="pop"><b>'+esc(s.name)+'</b>'+esc(s.sub)+'<br><a href="#" onclick="window.ReactNativeWebView.postMessage(\\''+s.id+'\\');return false;">'+esc(detailLabel)+'</a></div>');
  });
}
</script></body></html>`;

export default function MapScreen() {
  const { t, i18n } = useTranslation();
  const webView = useRef<WebView>(null);
  const [ready, setReady] = useState(false);
  const [contentId, setContentId] = useState<number | undefined>();
  const { data: contents } = useApi(() => getContents(), []);
  const { data: spots } = useApi(() => getSpots(), []);

  useEffect(() => {
    if (!ready || !spots) return;
    const ko = i18n.language === 'ko';
    const items = spots
      .filter((s) => !contentId || s.contents.some((c) => c.id === contentId))
      .map((s) => ({
        id: s.id,
        lat: s.latitude,
        lng: s.longitude,
        name: ko ? s.name_ko : s.name_en,
        sub: s.contents.map((c) => c.name_en).join(', '),
      }));
    webView.current?.injectJavaScript(
      `setSpots(${JSON.stringify(items)}, ${JSON.stringify(t('map.details'))}); true;`,
    );
  }, [ready, spots, contentId, i18n.language, t]);

  const onMessage = (e: WebViewMessageEvent) => router.push(`/spot/${e.nativeEvent.data}`);

  return (
    <View style={styles.screen}>
      <WebView
        ref={webView}
        style={StyleSheet.absoluteFill}
        originWhitelist={['*']}
        source={{ html: MAP_HTML, baseUrl: 'https://localhost' }}
        onLoadEnd={() => setReady(true)}
        onMessage={onMessage}
      />
      <SafeAreaView edges={['top']} pointerEvents="box-none" style={styles.overlay}>
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

const styles = StyleSheet.create({
  screen: { flex: 1 },
  overlay: { position: 'absolute', top: 0, left: 0, right: 0 },
  chips: { gap: Spacing.two, padding: Spacing.three },
});
