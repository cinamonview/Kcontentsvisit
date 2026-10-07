import { Linking } from 'react-native';

import type { Spot } from '@/api';

/** F-05: open directions in Google Maps (app if installed, otherwise the web). */
export function openGoogleMaps(spot: Spot) {
  const query = `${spot.latitude},${spot.longitude}`;
  return Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`);
}

/** F-05: open Naver Map, falling back to the web if the app isn't installed. */
export async function openNaverMap(spot: Spot) {
  const name = encodeURIComponent(spot.name_ko);
  const appUrl = `nmap://place?lat=${spot.latitude}&lng=${spot.longitude}&name=${name}&appname=com.kspottrail.app`;
  try {
    await Linking.openURL(appUrl);
  } catch {
    await Linking.openURL(`https://map.naver.com/p/search/${name}`);
  }
}

/** F-20: add a start time to a YouTube link, e.g. "MV 0:10". */
export function withStartTime(url: string, seconds: number | null) {
  if (seconds == null) return url;
  return `${url}${url.includes('?') ? '&' : '?'}t=${seconds}`;
}

export function openUrl(url: string) {
  return Linking.openURL(url);
}
