import { useTranslation } from 'react-i18next';

import { Input, Select } from '@shared/components/ui';
import { ORDER_STATUS } from '@shared/constants';

import styles from './Orders.module.css';

function OrdersFilter({
  searchQuery,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  filteredCount,
  onReset,
}) {
  const { t } = useTranslation('orders');

  const statusOptions = [
    { value: 'all', label: t('filters.all') },
    { value: ORDER_STATUS.PLACED, label: t('status.placed') },
    { value: ORDER_STATUS.PROCESSING, label: t('status.processing') },
    { value: ORDER_STATUS.SHIPPED, label: t('status.shipped') },
    { value: ORDER_STATUS.DELIVERED, label: t('status.delivered') },
    { value: ORDER_STATUS.CANCELLED, label: t('status.cancelled') },
  ];

  const hasActiveFilters = Boolean(
    (selectedStatus && selectedStatus !== 'all') || searchQuery.trim(),
  );

  return (
    <div className={styles.filterBar} role="search" aria-label={t('page.title')}>
      <div className={styles.filterControls}>
        <div className={styles.searchField}>
          <Input
            id="order-search-input"
            name="searchQuery"
            type="search"
            label={t('filters.searchLabel')}
            placeholder={t('filters.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <div className={styles.statusField}>
          <Select
            id="order-status-select"
            name="statusFilter"
            label={t('filters.statusLabel')}
            options={statusOptions}
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.filterMeta}>
        <span>{t('page.count', { count: filteredCount })}</span>

        {hasActiveFilters && (
          <button type="button" onClick={onReset} className={styles.resetBtn}>
            {t('filters.resetFilters')}
          </button>
        )}
      </div>
    </div>
  );
}

export default OrdersFilter;
