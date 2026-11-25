import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { useGetProductsByIdsQuery, useProductCardActions } from '@features/catalog';
import {
  clearWishlist,
  selectWishlistIds,
  selectWishlistItems,
  togglePriceAlert,
  WishlistCard,
} from '@features/wishlist';
import {
  Breadcrumbs,
  Button,
  Container,
  DataState,
  EmptyState,
  Skeleton,
} from '@shared/components/ui';
import { PATHS } from '@shared/constants';

import styles from './Wishlist.module.css';

function WishlistSkeleton({ count = 3 }) {
  return (
    <div className={styles.grid} aria-busy="true" data-testid="wishlist-skeleton">
      {Array.from({ length: Math.min(count, 6) }, (_, index) => (
        <Skeleton key={index} height={440} />
      ))}
    </div>
  );
}

function Wishlist() {
  const { t } = useTranslation(['wishlist', 'common']);
  const dispatch = useDispatch();
  const cardProps = useProductCardActions();

  const wishlistItems = useSelector(selectWishlistItems);
  const wishlistIds = useSelector(selectWishlistIds);

  const queryResult = useGetProductsByIdsQuery(wishlistIds, {
    skip: wishlistIds.length === 0,
  });

  const handleToggleAlert = (productId, price) => {
    dispatch(togglePriceAlert({ productId, price }));
  };

  const handleClearAll = () => {
    dispatch(clearWishlist());
  };

  const breadcrumbs = [
    { label: t('wishlist:breadcrumbs.home'), to: PATHS.HOME },
    { label: t('wishlist:breadcrumbs.wishlist') },
  ];

  const isEmpty = wishlistIds.length === 0;

  return (
    <main className={styles.page} data-testid="wishlist-page">
      <Container>
        <Breadcrumbs items={breadcrumbs} />

        <header className={styles.header}>
          <div className={styles.titleGroup}>
            <h1 className={styles.title}>{t('wishlist:page.title')}</h1>
            <p className={styles.subtitle}>{t('wishlist:page.subtitle')}</p>
          </div>

          {!isEmpty && (
            <div className={styles.headerMeta}>
              <span className={styles.countBadge} data-testid="wishlist-count-badge">
                {t('wishlist:page.itemCount', { count: wishlistIds.length })}
              </span>
              <Button
                variant="quiet"
                onClick={handleClearAll}
                className={styles.clearBtn}
                data-testid="clear-wishlist-btn"
              >
                {t('wishlist:page.clearAll')}
              </Button>
            </div>
          )}
        </header>

        {isEmpty ? (
          <div data-testid="wishlist-empty-state">
            <EmptyState
              title={t('wishlist:empty.title')}
              text={t('wishlist:empty.text')}
              action={
                <Button to={PATHS.PRODUCTS} variant="primary" data-testid="explore-catalog-btn">
                  {t('wishlist:empty.action')}
                </Button>
              }
            />
          </div>
        ) : (
          <DataState
            result={queryResult}
            loading={<WishlistSkeleton count={wishlistIds.length} />}
            empty={
              <EmptyState
                title={t('wishlist:empty.title')}
                text={t('wishlist:empty.text')}
                action={
                  <Button to={PATHS.PRODUCTS} variant="primary" data-testid="explore-catalog-btn">
                    {t('wishlist:empty.action')}
                  </Button>
                }
              />
            }
          >
            {(products) => {
              const availableProducts = (products ?? []).filter(Boolean);

              if (availableProducts.length === 0) {
                return (
                  <EmptyState
                    title={t('wishlist:empty.title')}
                    text={t('wishlist:empty.text')}
                    action={
                      <Button
                        to={PATHS.PRODUCTS}
                        variant="primary"
                        data-testid="explore-catalog-btn"
                      >
                        {t('wishlist:empty.action')}
                      </Button>
                    }
                  />
                );
              }

              return (
                <div className={styles.grid} data-testid="wishlist-grid">
                  {availableProducts.map((product) => {
                    const savedItem = wishlistItems.find((item) => item.productId === product.id);
                    return (
                      <WishlistCard
                        key={product.id}
                        product={product}
                        savedItem={savedItem}
                        cardProps={cardProps}
                        onToggleAlert={handleToggleAlert}
                      />
                    );
                  })}
                </div>
              );
            }}
          </DataState>
        )}
      </Container>
    </main>
  );
}

export default Wishlist;
