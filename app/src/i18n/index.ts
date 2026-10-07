// Screen text lives here so another language is one more file (F-13).
// English first; Korean follows the device language.

import { getLocales } from 'expo-localization';
import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './en.json';
import ko from './ko.json';

const deviceLanguage = getLocales()[0]?.languageCode ?? 'en';

const i18n = createInstance();

i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, ko: { translation: ko } },
  lng: deviceLanguage === 'ko' ? 'ko' : 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;
