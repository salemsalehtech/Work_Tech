/**
 * Lookup table mapping db.json product tags to i18n keys (in `catalog` namespace)
 * and Badge tone variants ('ink' | 'blue' | 'value' | 'success' | 'placed' | 'neutral').
 */
export const PRODUCT_TAGS = {
  gaming: { labelKey: 'tags.gaming', tone: 'ink' },
  business: { labelKey: 'tags.business', tone: 'blue' },
  ultrabook: { labelKey: 'tags.ultrabook', tone: 'value' },
  student: { labelKey: 'tags.student', tone: 'success' },
  creator: { labelKey: 'tags.creator', tone: 'placed' },
  oled: { labelKey: 'tags.oled', tone: 'blue' },
  '2-in-1': { labelKey: 'tags.twoInOne', tone: 'neutral' },
};

/**
 * Returns the first configured tag definition ({ labelKey, tone }) for a product's tags array,
 * or null when no known tag matches.
 * @param {string[]} [tags]
 */
export function getProductTag(tags = []) {
  for (const tag of tags) {
    if (PRODUCT_TAGS[tag]) {
      return PRODUCT_TAGS[tag];
    }
  }
  return null;
}
