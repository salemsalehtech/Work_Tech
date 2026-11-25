import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { AccountLayout } from '@features/auth';
import { useGetProductsByIdsQuery, useProductCardActions } from '@features/catalog';
import { selectWishlistItems, setPriceAlert } from '@features/wishlist';
import { Button, DataState, EmptyState, Skeleton } from '@shared/components/ui';
import { PATHS } from '@shared/constants';

import styles from './Wishlist.module.css';
import WishlistCard from './WishlistCard';

function Wishlist() {
  const { t } = useTranslation('wishlist');
  const dispatch = useDispatch();
  const items = useSelector(selectWishlistItems);
  const actionsOf = useProductCardActions();
  const ids = items.map((item) => item.productId);
  const result = useGetProductsByIdsQuery(ids, { skip: ids.length === 0 });

  return (
    <AccountLayout title={t('title')} meta={t('count', { count: items.length })}>
      {items.length === 0 ? (
        <EmptyState
          title={t('empty.title')}
          text={t('empty.text')}
          action={<Button to={PATHS.PRODUCTS}>{t('empty.action')}</Button>}
        />
      ) : (
        <DataState
          result={result}
          loading={
            <div className={styles.grid} aria-busy="true">
              {ids.map((id) => (
                <Skeleton key={id} height={440} />
              ))}
            </div>
          }
        >
          {(products) => (
            <ul className={styles.grid}>
              {items.map((saved) => {
                const product = products.find(({ id }) => id === saved.productId);
                return (
                  product && (
                    <WishlistCard
                      key={product.id}
                      product={product}
                      saved={saved}
                      actions={actionsOf(product)}
                      onAlertChange={(enabled) =>
                        dispatch(setPriceAlert({ productId: product.id, enabled }))
                      }
                    />
                  )
                );
              })}
            </ul>
          )}
        </DataState>
      )}
    </AccountLayout>
  );
}

export default Wishlist;
