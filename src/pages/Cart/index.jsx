import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import {
  AccessorySuggestions,
  addItem,
  calcCartTotals,
  CartLine,
  CartSummary,
  clearCart,
  FreeShippingProgress,
  PromoCode,
  removeItem,
  selectCartCount,
  selectCartItems,
  selectPromoCode,
  setQuantity,
  toCartItem,
} from '@features/cart';
import { Breadcrumbs, Button, Container, EmptyState } from '@shared/components/ui';
import { PATHS } from '@shared/constants';

import styles from './Cart.module.css';

function Cart() {
  const { t } = useTranslation('cart');
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const count = useSelector(selectCartCount);
  const promoCode = useSelector(selectPromoCode);
  const totals = calcCartTotals(items, { promoCode });

  return (
    <Container className={styles.page}>
      <Breadcrumbs
        items={[{ label: t('breadcrumb.home'), to: PATHS.HOME }, { label: t('breadcrumb.cart') }]}
      />

      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>{t('title')}</h1>
          <p className={styles.count}>{t('itemCount', { count })}</p>
        </div>
        {items.length > 0 && (
          <Button variant="danger" onClick={() => dispatch(clearCart())}>
            {t('clearCart')}
          </Button>
        )}
      </header>

      {items.length === 0 ? (
        <EmptyState
          title={t('empty.title')}
          text={t('empty.description')}
          action={<Button to={PATHS.PRODUCTS}>{t('empty.button')}</Button>}
        />
      ) : (
        <div className={styles.layout}>
          <div className={styles.main}>
            <div>
              {items.map((item) => (
                <CartLine
                  key={item.key}
                  item={item}
                  onQuantityChange={(quantity) =>
                    dispatch(setQuantity({ key: item.key, quantity }))
                  }
                  onRemove={() => dispatch(removeItem(item.key))}
                />
              ))}
            </div>

            <Link to={PATHS.PRODUCTS} className={styles.continue}>
              {t('continueShopping')}
            </Link>

            <FreeShippingProgress subtotal={totals.subtotal} />

            <AccessorySuggestions
              excludeIds={items.map((item) => item.productId)}
              onAdd={(accessory) => dispatch(addItem(toCartItem(accessory)))}
            />
          </div>

          <CartSummary
            totals={totals}
            note={t('summary.secure')}
            action={
              <Button to={PATHS.CHECKOUT} size="xl" fullWidth>
                {t('summary.checkout')}
              </Button>
            }
          >
            <PromoCode subtotal={totals.subtotal} />
          </CartSummary>
        </div>
      )}
    </Container>
  );
}

export default Cart;
