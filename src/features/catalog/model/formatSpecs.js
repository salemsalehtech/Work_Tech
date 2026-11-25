const SPEC_ORDER = [
  'cpu',
  'cores',
  'threads',
  'gpu',
  'gpuVram',
  'gpuTgp',
  'ram',
  'storage',
  'screen',
  'resolution',
  'panel',
  'refreshRate',
  'battery',
  'weight',
  'thickness',
  'os',
  'thunderbolt',
  'videoOut',
  'wifi',
  'bluetooth',
  'ports',
  'webcam',
  'keyboard',
];

// Specs stored as plain numbers, and the unit each one is shown in.
const UNITS = {
  ram: 'gb',
  gpuVram: 'gb',
  storage: 'gb',
  screen: 'inch',
  refreshRate: 'hz',
  gpuTgp: 'watt',
  weight: 'kg',
  thickness: 'mm',
};

const isMissing = (value) => value === null || value === undefined || value.length === 0;

function formatValue(key, value, t) {
  if (Array.isArray(value)) return value.join(' · ');
  if (key === 'storage' && value >= 1024) return t('specs.units.tb', { value: value / 1024 });
  return UNITS[key] ? t(`specs.units.${UNITS[key]}`, { value }) : String(value);
}

/** Rows of the specifications tab: [{ key, label, value }], translated, without the empty ones. */
export function formatProductSpecs(specs, t) {
  return SPEC_ORDER.filter((key) => !isMissing(specs[key])).map((key) => ({
    key,
    label: t(`specs.labels.${key}`),
    value: formatValue(key, specs[key], t),
  }));
}
