import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { useCheckout, validateShipping } from '@features/checkout';
import { Breadcrumbs, Container } from '@shared/components/ui';
import { EXPRESS_FEE } from '@shared/constants';
import { formatPrice } from '@shared/utils/formatPrice';

import styles from './Checkout.module.css';
function Checkout() {
  const { t, i18n } = useTranslation('checkout');

  const { items, shipping, express, expressAvailable, totals, setExpress, updateShipping } =
    useCheckout();

  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);

  const money = (value) => formatPrice(value, i18n.language);

  const handleChange = (field, value) => {
    updateShipping(field, value);
    setErrors((current) => ({ ...current, [field]: null }));
    setIsValid(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const error = validateShipping(shipping);

    if (error) {
      setErrors({ [error.field]: error.errorKey });
      setIsValid(false);
      return;
    }

    setErrors({});
    setIsValid(true);
  };

  if (items.length === 0) {
    return (
      <main className={styles.page}>
        <Container>
          <h1>{t('empty.title')}</h1>
          <p>{t('empty.description')}</p>
          <Link to="/products">{t('empty.button')}</Link>
        </Container>
      </main>
    );
  }

  const renderError = (field) =>
    errors[field] && <small className={styles.error}>{t(errors[field])}</small>;

  return (
    <main className={styles.page}>
      <Container>
        <Breadcrumbs
          items={[
            { label: t('breadcrumb.home'), to: '/' },
            { label: t('breadcrumb.cart'), to: '/cart' },
            { label: t('breadcrumb.checkout') },
          ]}
        />

        <h1 className={styles.title}>{t('title')}</h1>

        <div className={styles.layout}>
          <section className={styles.formSection}>
            <form onSubmit={handleSubmit}>
              <h2>{t('shipping.title')}</h2>

              <div className={styles.form}>
                <label>
                  {t('shipping.fullName')}
                  <input
                    type="text"
                    value={shipping.fullName}
                    onChange={(event) => handleChange('fullName', event.target.value)}
                    aria-invalid={Boolean(errors.fullName)}
                  />
                  {renderError('fullName')}
                </label>

                <label>
                  {t('shipping.phone')}
                  <input
                    type="tel"
                    value={shipping.phone}
                    onChange={(event) => handleChange('phone', event.target.value)}
                    aria-invalid={Boolean(errors.phone)}
                  />
                  {renderError('phone')}
                </label>

                <label>
                  {t('shipping.city')}
                  <select
                    value={shipping.city}
                    onChange={(event) => handleChange('city', event.target.value)}
                    aria-invalid={Boolean(errors.city)}
                  >
                    <option value="">{t('shipping.selectCity')}</option>
                    <option value="Cairo">{t('cities.cairo')}</option>
                    <option value="Giza">{t('cities.giza')}</option>
                    <option value="Alexandria">{t('cities.alexandria')}</option>
                    <option value="Other">{t('cities.other')}</option>
                  </select>
                  {renderError('city')}
                </label>

                <label>
                  {t('shipping.address')}
                  <textarea
                    value={shipping.address}
                    onChange={(event) => handleChange('address', event.target.value)}
                    aria-invalid={Boolean(errors.address)}
                  />
                  {renderError('address')}
                </label>
              </div>

              <div className={styles.delivery}>
                <h2>{t('delivery.title')}</h2>

                <label className={styles.deliveryOption}>
                  <input
                    type="radio"
                    name="delivery"
                    checked={!express}
                    onChange={() => setExpress(false)}
                  />
                  <span>{t('delivery.standard')}</span>
                  <strong>{money(totals.shipping - (express ? EXPRESS_FEE : 0))}</strong>
                </label>

                <label
                  className={`${styles.deliveryOption} ${!expressAvailable ? styles.disabled : ''}`}
                >
                  <input
                    type="radio"
                    name="delivery"
                    checked={express}
                    disabled={!expressAvailable}
                    onChange={() => setExpress(true)}
                  />

                  <span>
                    {t('delivery.express')}
                    {!expressAvailable && <small>{t('delivery.unavailable')}</small>}
                  </span>

                  <strong>{money(EXPRESS_FEE)}</strong>
                </label>
              </div>

              {isValid && <p className={styles.success}>{t('shipping.valid')}</p>}

              <button type="submit" className={styles.continueButton}>
                {t('continue')}
              </button>
            </form>
          </section>

          <aside className={styles.summary}>
            <h2>{t('summary.title')}</h2>

            {items.map((item) => (
              <div className={styles.summaryItem} key={item.key}>
                <span>
                  {item.name} × {item.quantity}
                </span>
                <strong>{money(item.price * item.quantity)}</strong>
              </div>
            ))}

            <div className={styles.summaryRow}>
              <span>{t('summary.subtotal')}</span>
              <strong>{money(totals.products)}</strong>
            </div>

            {totals.warranty > 0 && (
              <div className={styles.summaryRow}>
                <span>{t('summary.warranty')}</span>
                <strong>{money(totals.warranty)}</strong>
              </div>
            )}

            <div className={styles.summaryRow}>
              <span>{t('summary.shipping')}</span>
              <strong>{money(totals.shipping)}</strong>
            </div>

            {totals.discount > 0 && (
              <div className={styles.summaryRow}>
                <span>{t('summary.discount')}</span>
                <strong>-{money(totals.discount)}</strong>
              </div>
            )}

            <div className={styles.total}>
              <span>{t('summary.total')}</span>
              <strong>{money(totals.total)}</strong>
            </div>
          </aside>
        </div>
      </Container>
    </main>
  );
}

export default Checkout;
