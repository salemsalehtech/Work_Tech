import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import {
  applyPromo,
  calcCartTotals,
  calcPromo,
  clearCart,
  removeItem,
  removePromo,
  selectCartItems,
  setQuantity,
} from '@features/cart';
import { Breadcrumbs, Container, ProductImage, QuantityStepper } from '@shared/components/ui';
import { FREE_SHIPPING_THRESHOLD } from '@shared/constants';
import { formatPrice } from '@shared/utils/formatPrice';

import styles from './Cart.module.css';

function Cart() {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation('cart');

  const items = useSelector(selectCartItems);
  const promoCode = useSelector((state) => state.cart.promoCode);

  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');

  const totals = calcCartTotals(items, { promoCode });
  const isEmpty = items.length === 0;

  const money = (value) => formatPrice(value, i18n.language);

  const promo = promoCode ? calcPromo(promoCode, totals.subtotal) : null;

  const remainingForFreeShipping = Math.max(FREE_SHIPPING_THRESHOLD - totals.subtotal, 0);

  const shippingProgress = Math.min((totals.subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);

  const handleApplyPromo = (event) => {
    event.preventDefault();

    const result = calcPromo(promoInput, totals.subtotal);

    if (!result) {
      setPromoError(t('promo.invalid'));
      return;
    }

    dispatch(applyPromo(result.code));
    setPromoInput('');
    setPromoError('');
  };

  const handleRemovePromo = () => {
    dispatch(removePromo());
    setPromoError('');
  };

  return (
    <main className={styles.page}>
      <Container>
        <Breadcrumbs
          items={[{ label: t('breadcrumb.home'), to: '/' }, { label: t('breadcrumb.cart') }]}
        />

        <div className={styles.header}>
          <div>
            <h1>{t('title')}</h1>
            <p>{t('itemCount', { count: items.reduce((sum, item) => sum + item.quantity, 0) })}</p>
          </div>

          {!isEmpty && (
            <button
              type="button"
              className={styles.clearButton}
              onClick={() => dispatch(clearCart())}
            >
              {t('clearCart')}
            </button>
          )}
        </div>

        {isEmpty ? (
          <section className={styles.empty}>
            <div className={styles.emptyIcon}>🛒</div>
            <h2>{t('empty.title')}</h2>
            <p>{t('empty.description')}</p>
            <Link to="/products" className={styles.primaryButton}>
              {t('empty.button')}
            </Link>
          </section>
        ) : (
          <div className={styles.layout}>
            <section className={styles.itemsSection}>
              <div className={styles.itemsHeader}>
                <h2>{t('itemsTitle')}</h2>
                <span>
                  {items.length} {t('products')}
                </span>
              </div>

              <div className={styles.itemsList}>
                {items.map((item) => (
                  <article className={styles.item} key={item.key}>
                    <ProductImage
                      src={item.image}
                      alt={item.name}
                      className={styles.productImage}
                    />

                    <div className={styles.itemDetails}>
                      <div className={styles.itemTop}>
                        <div>
                          <span className={styles.brand}>{item.brand}</span>
                          <h3>{item.name}</h3>
                          {item.specsLine && <p className={styles.specs}>{item.specsLine}</p>}
                        </div>

                        <button
                          type="button"
                          className={styles.removeButton}
                          onClick={() => dispatch(removeItem(item.key))}
                          aria-label={t('removeItem')}
                          title={t('removeItem')}
                        >
                          ×
                        </button>
                      </div>

                      {item.options && (
                        <div className={styles.options}>
                          {Object.entries(item.options)
                            .filter(([, value]) => value)
                            .map(([key, value]) => (
                              <span key={key}>
                                {t(`options.${key}`, { defaultValue: key })}: {value}
                              </span>
                            ))}
                        </div>
                      )}

                      <div className={styles.itemBottom}>
                        <QuantityStepper
                          value={item.quantity}
                          min={1}
                          max={item.stock}
                          onChange={(quantity) =>
                            dispatch(
                              setQuantity({
                                key: item.key,
                                quantity,
                              }),
                            )
                          }
                        />

                        <strong className={styles.itemPrice}>
                          {money(item.price * item.quantity)}
                        </strong>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              <Link to="/products" className={styles.continueLink}>
                ← {t('continueShopping')}
              </Link>

              <section className={styles.shippingProgress}>
                <div className={styles.shippingText}>
                  {remainingForFreeShipping > 0 ? (
                    <p>
                      {t('shipping.remaining', {
                        amount: money(remainingForFreeShipping),
                      })}
                    </p>
                  ) : (
                    <p className={styles.shippingSuccess}>{t('shipping.unlocked')}</p>
                  )}
                </div>

                <div
                  className={styles.progressTrack}
                  role="progressbar"
                  aria-valuenow={Math.round(shippingProgress)}
                  aria-valuemin="0"
                  aria-valuemax="100"
                >
                  <div className={styles.progressFill} style={{ width: `${shippingProgress}%` }} />
                </div>
              </section>
            </section>

            <aside className={styles.summary}>
              <h2>{t('summary.title')}</h2>

              <form className={styles.promoForm} onSubmit={handleApplyPromo}>
                <label htmlFor="promoCode">{t('promo.label')}</label>

                <div className={styles.promoInputRow}>
                  <input
                    id="promoCode"
                    type="text"
                    value={promoInput}
                    onChange={(event) => {
                      setPromoInput(event.target.value);
                      setPromoError('');
                    }}
                    placeholder={t('promo.placeholder')}
                  />

                  <button type="submit">{t('promo.apply')}</button>
                </div>

                {promoError && <p className={styles.errorMessage}>{promoError}</p>}

                {promo && (
                  <div className={styles.appliedPromo}>
                    <span>
                      ✓ {promo.code} {t('promo.applied')}
                    </span>

                    <button type="button" onClick={handleRemovePromo}>
                      {t('promo.remove')}
                    </button>
                  </div>
                )}
              </form>

              <div className={styles.summaryRows}>
                <div className={styles.summaryRow}>
                  <span>{t('summary.subtotal')}</span>
                  <span>{money(totals.products)}</span>
                </div>

                {totals.warranty > 0 && (
                  <div className={styles.summaryRow}>
                    <span>{t('summary.warranty')}</span>
                    <span>{money(totals.warranty)}</span>
                  </div>
                )}

                <div className={styles.summaryRow}>
                  <span>{t('summary.shipping')}</span>
                  <span>{totals.shipping === 0 ? t('summary.free') : money(totals.shipping)}</span>
                </div>

                {totals.discount > 0 && (
                  <div className={`${styles.summaryRow} ${styles.discount}`}>
                    <span>{t('summary.discount')}</span>
                    <span>-{money(totals.discount)}</span>
                  </div>
                )}
              </div>

              <div className={styles.totalRow}>
                <span>{t('summary.total')}</span>
                <strong>{money(totals.total)}</strong>
              </div>

              <Link to="/checkout" className={styles.checkoutButton}>
                {t('summary.checkout')}
              </Link>

              <p className={styles.secureNote}>🔒 {t('summary.secure')}</p>
            </aside>
          </div>
        )}
      </Container>
    </main>
  );
}

export default Cart;
