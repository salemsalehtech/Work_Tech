import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { Button, Input } from '@shared/components/ui';

import { applyPromo, removePromo, selectPromoCode } from '../../cartSlice';
import { calcPromo } from '../../model/cartTotals';

import styles from './PromoCode.module.css';

/** The promo code field, or the applied code with its remove button. */
function PromoCode({ subtotal }) {
  const { t } = useTranslation('cart');
  const dispatch = useDispatch();
  const applied = useSelector(selectPromoCode);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const promo = calcPromo(code, subtotal);
    if (!promo) {
      setError(t('promo.invalid'));
      return;
    }
    dispatch(applyPromo(promo.code));
    setCode('');
  };

  if (applied) {
    return (
      <div className={styles.applied}>
        <span>{t('promo.applied', { code: applied })}</span>
        <Button variant="danger" onClick={() => dispatch(removePromo())}>
          {t('common:actions.remove')}
        </Button>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <Input
        id="promo-code"
        label={t('promo.label')}
        placeholder={t('promo.placeholder')}
        value={code}
        error={error}
        onChange={(event) => {
          setCode(event.target.value);
          setError('');
        }}
      />
      <Button type="submit" variant="dark">
        {t('promo.apply')}
      </Button>
    </form>
  );
}

export default PromoCode;
