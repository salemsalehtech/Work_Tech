import { describe, expect, it } from 'vitest';

import arCatalog from '../../../services/i18n/locales/ar/catalog.json';
import enCatalog from '../../../services/i18n/locales/en/catalog.json';

import { formatProductSpecs } from './formatSpecs';

function createTranslator(dict) {
  return (key, vars = {}) => {
    const raw = key.split('.').reduce((acc, part) => acc?.[part], dict) ?? vars.defaultValue ?? key;
    return String(raw).replace(/\{\{(\w+)\}\}/g, (_, name) => vars[name] ?? '');
  };
}

describe('formatProductSpecs', () => {
  const sampleSpecs = {
    cpu: 'Intel Core Ultra 7 255H',
    ram: 16,
    storage: 1024,
    gpu: 'Intel Arc',
    gpuVram: null,
    gpuTgp: null,
    screen: 14,
    refreshRate: 120,
    weight: 1.2,
    thickness: 14.9,
    battery: null,
    os: '',
    ports: ['2× Thunderbolt 4', 'HDMI 2.0'],
  };

  it('omits null, undefined, and empty string fields', () => {
    const tEn = createTranslator(enCatalog);
    const rows = formatProductSpecs(sampleSpecs, tEn);
    const keys = rows.map((row) => row.key);

    expect(keys).not.toContain('gpuVram');
    expect(keys).not.toContain('gpuTgp');
    expect(keys).not.toContain('battery');
    expect(keys).not.toContain('os');
  });

  it('formats values with the right English units', () => {
    const tEn = createTranslator(enCatalog);
    const rows = Object.fromEntries(
      formatProductSpecs(sampleSpecs, tEn).map((row) => [row.key, row.value]),
    );

    expect(rows.ram).toBe('16 GB');
    expect(rows.storage).toBe('1 TB');
    expect(rows.screen).toBe('14"');
    expect(rows.refreshRate).toBe('120 Hz');
    expect(rows.weight).toBe('1.2 kg');
    expect(rows.thickness).toBe('14.9 mm');
    expect(rows.ports).toBe('2× Thunderbolt 4 · HDMI 2.0');
  });

  it('formats values with the right Arabic units', () => {
    const tAr = createTranslator(arCatalog);
    const rows = Object.fromEntries(
      formatProductSpecs(sampleSpecs, tAr).map((row) => [row.key, row.value]),
    );

    expect(rows.ram).toBe('16 جيجابايت');
    expect(rows.storage).toBe('1 تيرابايت');
    expect(rows.screen).toBe('14 بوصة');
    expect(rows.refreshRate).toBe('120 هرتز');
    expect(rows.weight).toBe('1.2 كجم');
    expect(rows.thickness).toBe('14.9 مم');
  });
});
