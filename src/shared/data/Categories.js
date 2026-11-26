export const CATEGORIES = [
  { key: 'All Laptops' },
  { key: 'Gaming', params: { tags_like: 'gaming' } },
  { key: 'Business', params: { tags_like: 'business' } },
  { key: 'Ultrabooks', params: { tags_like: 'ultrabook' } },
  { key: '2-in-1', params: { tags_like: '2-in-1' } },
  { key: 'Under 30,000 EGP', params: { price_lte: 30000 } },
  { key: 'Deals', params: { deal: true }, highlight: true },
];
