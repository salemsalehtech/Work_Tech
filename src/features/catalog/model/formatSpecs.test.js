import i18n from '@services/i18n';

import { formatProductSpecs } from './formatSpecs';

const specs = {
  cpu: 'Intel Core Ultra 7 255H',
  cores: 16,
  ram: 16,
  storage: 1024,
  gpuVram: null,
  screen: 14,
  refreshRate: 120,
  weight: 1.2,
  thickness: 14.9,
  battery: null,
  os: '',
  ports: ['2× Thunderbolt 4', 'HDMI 2.0'],
};
const rowsIn = (lang) =>
  Object.fromEntries(
    formatProductSpecs(specs, i18n.getFixedT(lang, 'catalog')).map((row) => [row.key, row]),
  );

it('leaves out the empty specs', () => {
  const rows = rowsIn('en');

  expect(rows).not.toHaveProperty('gpuVram');
  expect(rows).not.toHaveProperty('battery');
  expect(rows).not.toHaveProperty('os');
});

it('shows the English units', () => {
  const rows = rowsIn('en');

  expect(rows.ram).toEqual({ key: 'ram', label: 'Memory', value: '16 GB' });
  expect(rows.storage.value).toBe('1 TB');
  expect(rows.screen.value).toBe('14″');
  expect(rows.refreshRate.value).toBe('120 Hz');
  expect(rows.weight.value).toBe('1.2 kg');
  expect(rows.thickness.value).toBe('14.9 mm');
  expect(rows.cores.value).toBe('16');
  expect(rows.ports.value).toBe('2× Thunderbolt 4 · HDMI 2.0');
});

it('shows the Arabic units', () => {
  const rows = rowsIn('ar');

  expect(rows.ram).toEqual({ key: 'ram', label: 'الذاكرة العشوائية', value: '16 جيجابايت' });
  expect(rows.storage.value).toBe('1 تيرابايت');
  expect(rows.weight.value).toBe('1.2 كجم');
});

it('names every spec of the data in both languages', () => {
  for (const lang of ['en', 'ar']) {
    const labels = i18n.getResourceBundle(lang, 'catalog').specs.labels;
    expect(Object.keys(labels)).toHaveLength(23);
  }
});
