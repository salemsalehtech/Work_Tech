export const CATEGORIES = [
  { key: 'all' },
  { key: 'gaming', params: { tags_like: 'gaming' } },
  { key: 'business', params: { tags_like: 'business' } },
  { key: 'ultrabooks', params: { tags_like: 'ultrabook' } },
  { key: 'two-in-one', params: { tags_like: '2-in-1' } },
  { key: 'under-30000', params: { price_lte: 30000 } },
  { key: 'deals', params: { deal: true }, highlight: true },
];
