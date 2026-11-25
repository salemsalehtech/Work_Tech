import { useTranslation } from 'react-i18next';

import { Input, SegmentedControl } from '@shared/components/ui';

import { countOrders, ORDER_FILTER_KEYS } from '../../model/orders';

import styles from './OrderFilters.module.css';

/** Search and status chips of My orders. */
function OrderFilters({ orders, filter, query, onFilterChange, onQueryChange }) {
  const { t } = useTranslation('orders');

  return (
    <div className={styles.filters}>
      <Input
        id="order-search"
        type="search"
        label={t('search')}
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
      />
      <SegmentedControl
        variant="chips"
        ariaLabel={t('filter.label')}
        options={ORDER_FILTER_KEYS.map((key) => ({
          value: key,
          label: t(`filter.${key}`),
          count: countOrders(orders, key),
        }))}
        value={filter}
        onChange={onFilterChange}
      />
    </div>
  );
}

export default OrderFilters;
