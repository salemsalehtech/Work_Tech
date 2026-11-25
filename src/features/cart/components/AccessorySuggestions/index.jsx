import { useTranslation } from 'react-i18next';

import { Button, DataState, SectionHeader, Skeleton } from '@shared/components/ui';
import { formatPrice } from '@shared/utils';

import { useGetAccessoriesQuery } from '../../api/accessoriesApi';

import styles from './AccessorySuggestions.module.css';

const SUGGESTIONS = 4;

/** "Complete the setup": accessories in stock that are not in the cart yet. */
function AccessorySuggestions({ excludeIds, onAdd }) {
  const { t, i18n } = useTranslation('cart');
  const result = useGetAccessoriesQuery();
  const pick = (accessories) =>
    accessories
      .filter(({ id, stock }) => stock > 0 && !excludeIds.includes(id))
      .slice(0, SUGGESTIONS);

  return (
    <DataState
      result={result}
      loading={<Skeleton height={160} />}
      isEmpty={(accessories) => pick(accessories ?? []).length === 0}
    >
      {(accessories) => (
        <section className={styles.section}>
          <SectionHeader title={t('accessories.title')} size="sm" />
          <ul className={styles.grid}>
            {pick(accessories).map((accessory) => (
              <li key={accessory.id} className={styles.tile}>
                <span className={styles.category}>
                  {t(`accessories.category.${accessory.category}`)}
                </span>
                <bdi className={styles.name}>{accessory.name}</bdi>
                <span className={styles.price}>{formatPrice(accessory.price, i18n.language)}</span>
                <Button variant="outline" size="sm" onClick={() => onAdd(accessory)}>
                  {t('accessories.add')}
                </Button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </DataState>
  );
}

export default AccessorySuggestions;
