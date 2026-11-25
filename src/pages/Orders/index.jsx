import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

import { AccountLayout, selectCurrentUser } from '@features/auth';
import { filterOrders, OrderCard, OrderFilters, useGetOrdersQuery } from '@features/orders';
import { Button, DataState, EmptyState, Skeleton } from '@shared/components/ui';
import { PATHS } from '@shared/constants';

import styles from './Orders.module.css';

function OrdersSkeleton() {
  return (
    <div className={styles.list} aria-busy="true">
      {[1, 2, 3].map((key) => (
        <Skeleton key={key} height={120} radius="var(--radius-lg)" />
      ))}
    </div>
  );
}

/** The filter and the search live in the URL. The typed text is kept here too, so fast typing is not lost. */
function OrderList({ orders }) {
  const { t } = useTranslation('orders');
  const [searchParams, setSearchParams] = useSearchParams();
  const filter = searchParams.get('status') ?? 'all';
  const [query, setQuery] = useState(searchParams.get('q') ?? '');
  const shown = filterOrders(orders, { filter, query });

  const setParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next, { replace: true, preventScrollReset: true });
  };

  const handleQueryChange = (value) => {
    setQuery(value);
    setParam('q', value);
  };

  const handleClear = () => {
    setQuery('');
    setSearchParams({}, { replace: true });
  };

  return (
    <div className={styles.list}>
      <OrderFilters
        orders={orders}
        filter={filter}
        query={query}
        onFilterChange={(value) => setParam('status', value === 'all' ? '' : value)}
        onQueryChange={handleQueryChange}
      />
      <p className={styles.count} role="status">
        {t('shown', { shown: shown.length, total: orders.length })}
      </p>
      {shown.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
      {shown.length === 0 && (
        <EmptyState
          title={t('noResults.title')}
          text={t('noResults.text')}
          action={
            <Button variant="outline" onClick={handleClear}>
              {t('noResults.action')}
            </Button>
          }
        />
      )}
    </div>
  );
}

function Orders() {
  const { t } = useTranslation('orders');
  const user = useSelector(selectCurrentUser);
  const result = useGetOrdersQuery(user.id);

  return (
    <AccountLayout title={t('title')}>
      <DataState
        result={result}
        loading={<OrdersSkeleton />}
        empty={
          <EmptyState
            title={t('empty.title')}
            text={t('empty.text')}
            action={<Button to={PATHS.PRODUCTS}>{t('empty.action')}</Button>}
          />
        }
      >
        {(orders) => <OrderList orders={orders} />}
      </DataState>
    </AccountLayout>
  );
}

export default Orders;
