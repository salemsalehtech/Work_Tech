/**
 * Filters that take several values.
 * key: the URL param · param: the json-server field · match: what to send, when it is not the value itself.
 * Labels are brand and product names, or a key of the catalog namespace.
 */
export const MULTI_FILTERS = [
  {
    key: 'brand',
    param: 'brand',
    options: ['ASUS', 'Lenovo', 'HP', 'Dell', 'Apple', 'Acer', 'MSI'].map((brand) => ({
      value: brand,
      label: brand,
    })),
  },
  {
    key: 'ram',
    param: 'specs.ram',
    options: [4, 8, 16, 24, 32, 64].map((ram) => ({
      value: String(ram),
      match: ram,
      labelKey: 'filters.ramOption',
      labelValues: { ram },
    })),
  },
  {
    key: 'cpu',
    param: 'specs.cpu_like',
    options: [
      { value: 'intel', match: 'Intel', label: 'Intel' },
      { value: 'amd', match: 'AMD|Ryzen', label: 'AMD' },
      { value: 'apple', match: 'Apple', label: 'Apple' },
    ],
  },
  {
    key: 'gpu',
    param: 'specs.gpu_like',
    options: [
      { value: 'integrated', match: 'Intel|Radeon|Apple', labelKey: 'filters.integrated' },
      ...[20, 30, 40, 50].map((series) => ({
        value: `rtx-${series}`,
        match: `RTX ${series}`,
        labelKey: 'filters.rtxSeries',
        labelValues: { series },
      })),
    ],
  },
  {
    key: 'screen',
    param: 'specs.screen_like',
    options: [
      { value: '13', match: '^1[34]', label: '13–14″' },
      { value: '15', match: '^15', label: '15″' },
      { value: '16', match: '^16', label: '16″' },
      { value: '17', match: '^17', label: '17″' },
    ],
  },
];

export const FILTER_KEYS = [
  ...MULTI_FILTERS.map(({ key }) => key),
  'min',
  'max',
  'rating',
  'inStock',
];

export const RATING_VALUES = ['4.5', '4', ''];

export const SORT_KEYS = ['featured', 'price-asc', 'price-desc', 'rating', 'newest'];
