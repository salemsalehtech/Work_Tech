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

function isMissing(value) {
  return (
    value === null ||
    value === undefined ||
    value === '' ||
    (Array.isArray(value) && value.length === 0)
  );
}

function formatSpecValue(key, value, t) {
  if (Array.isArray(value)) {
    return value.join(' · ');
  }

  switch (key) {
    case 'ram':
    case 'gpuVram':
      return t('specs.units.gb', { value });
    case 'storage':
      return value >= 1024
        ? t('specs.units.tb', { value: value / 1024 })
        : t('specs.units.gb', { value });
    case 'screen':
      return t('specs.units.inch', { value });
    case 'refreshRate':
      return t('specs.units.hz', { value });
    case 'gpuTgp':
      return t('specs.units.watt', { value });
    case 'weight':
      return t('specs.units.kg', { value });
    case 'thickness':
      return t('specs.units.mm', { value });
    case 'cores':
      return t('specs.units.cores', { value });
    case 'threads':
      return t('specs.units.threads', { value });
    default:
      return String(value);
  }
}

/**
 * Maps product.specs into [{ key, label, value }] with localized units,
 * skipping any null, undefined, or empty fields.
 */
export function formatProductSpecs(specs = {}, t) {
  if (!specs || typeof specs !== 'object') return [];

  const knownSet = new Set(SPEC_ORDER);
  const extraKeys = Object.keys(specs).filter((key) => !knownSet.has(key));
  const orderedKeys = [...SPEC_ORDER, ...extraKeys];

  return orderedKeys
    .filter((key) => !isMissing(specs[key]))
    .map((key) => ({
      key,
      label: t(`specs.labels.${key}`, { defaultValue: key }),
      value: formatSpecValue(key, specs[key], t),
    }));
}
