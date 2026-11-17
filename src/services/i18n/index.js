import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { loadState, saveState } from '@shared/utils';

/*
 * One JSON file per namespace and language: locales/<lang>/<namespace>.json.
 * A new file is picked up automatically; use it with useTranslation('<namespace>').
 */
const files = import.meta.glob('./locales/*/*.json', { eager: true, import: 'default' });

const resources = Object.entries(files).reduce((all, [path, messages]) => {
  const [, lang, namespace] = path.match(/locales\/(\w+)\/(\w+)\.json$/);
  all[lang] = { ...all[lang], [namespace]: messages };
  return all;
}, {});

export const LANGUAGES = ['en', 'ar'];
const LANGUAGE_KEY = 'language';

function applyDirection(lng) {
  document.documentElement.lang = lng;
  document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
}

i18n.on('languageChanged', (lng) => {
  applyDirection(lng);
  saveState(LANGUAGE_KEY, lng);
});

const saved = loadState(LANGUAGE_KEY, 'en');

i18n.use(initReactI18next).init({
  resources,
  lng: LANGUAGES.includes(saved) ? saved : 'en',
  fallbackLng: 'en',
  ns: Object.keys(resources.en),
  defaultNS: 'common',
  interpolation: { escapeValue: false },
});

applyDirection(i18n.language);

export default i18n;
