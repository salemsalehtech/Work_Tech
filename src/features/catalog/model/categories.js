// Categories of the store navigation. params go to json-server with the other catalog params.
export const CATEGORIES = [
  { key: 'gaming', params: { tags_like: 'gaming' } },
  { key: 'business', params: { tags_like: 'business' } },
  { key: 'ultrabooks', params: { tags_like: 'ultrabook' } },
  { key: 'two-in-one', params: { tags_like: '2-in-1' } },
  { key: 'under-30000', params: { price_lte: 30000 } },
  { key: 'deals', params: { oldPrice_gte: 1 } },
];

export const findCategory = (key) => CATEGORIES.find((category) => category.key === key);
