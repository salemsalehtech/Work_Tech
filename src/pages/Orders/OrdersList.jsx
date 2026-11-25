import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

import { Button, EmptyState } from '@shared/components/ui';

import OrderCard from './OrderCard';
import styles from './Orders.module.css';
import OrdersFilter from './OrdersFilter';
import { filterOrders, sortOrdersByDate } from './ordersUtils';

function OrdersList({ orders }) {
  const { t } = useTranslation('orders');
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedStatus = searchParams.get('status') || 'all';
  const searchQuery = searchParams.get('q') ?? searchParams.get('search') ?? '';

  const sortedOrders = useMemo(() => sortOrdersByDate(orders), [orders]);

  const filteredOrders = useMemo(
    () => filterOrders(sortedOrders, { status: selectedStatus, query: searchQuery }),
    [sortedOrders, selectedStatus, searchQuery],
  );

  const handleStatusChange = (newStatus) => {
    const next = new URLSearchParams(searchParams);
    if (newStatus && newStatus !== 'all') {
      next.set('status', newStatus);
    } else {
      next.delete('status');
    }
    setSearchParams(next);
  };

  const handleSearchChange = (newQuery) => {
    const next = new URLSearchParams(searchParams);
    if (newQuery) {
      next.set('q', newQuery);
    } else {
      next.delete('q');
      next.delete('search');
    }
    setSearchParams(next);
  };

  const handleReset = () => {
    const next = new URLSearchParams(searchParams);
    next.delete('status');
    next.delete('q');
    next.delete('search');
    setSearchParams(next);
  };

  return (
    <div className={styles.ordersSection}>
      <OrdersFilter
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        selectedStatus={selectedStatus}
        onStatusChange={handleStatusChange}
        filteredCount={filteredOrders.length}
        onReset={handleReset}
      />

      {filteredOrders.length === 0 ? (
        <EmptyState
          title={t('noResults.title')}
          text={t('noResults.text')}
          action={
            <Button variant="quiet" onClick={handleReset}>
              {t('noResults.action')}
            </Button>
          }
        />
      ) : (
        <div className={styles.ordersList} data-testid="orders-list">
          {filteredOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}

export default OrdersList;
