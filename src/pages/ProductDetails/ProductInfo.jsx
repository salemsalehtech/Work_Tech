import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { ProductOptions, useProductCardActions } from '@features/catalog';
import {
  Badge,
  Button,
  IconButton,
  InstallmentPicker,
  Price,
  Rating,
  ValueScore,
} from '@shared/components/ui';
import { DEFAULT_INSTALLMENT_MONTHS, LOW_STOCK_AT, PATHS } from '@shared/constants';
import { priceWithOptions, resolveSelection } from '@shared/utils';

import styles from './ProductDetails.module.css';

function StockBadge({ stock }) {
  const { t } = useTranslation('catalog');
  if (stock === 0) return <Badge tone="sale">{t('productCard.outOfStock')}</Badge>;
  return (
    <Badge tone="success">
      {stock <= LOW_STOCK_AT
        ? t('productCard.onlyLeft', { count: stock })
        : t('productDetails.inStock')}
    </Badge>
  );
}

/** The chosen options live in the URL, so a configured laptop can be shared and survives a reload. */
function ProductInfo({ product }) {
  const { t } = useTranslation('catalog');
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const actionsOf = useProductCardActions();
  const [months, setMonths] = useState(DEFAULT_INSTALLMENT_MONTHS);

  const selection = resolveSelection(product.options, Object.fromEntries(searchParams));
  const actions = actionsOf(product, { selection });
  const price = priceWithOptions(product.price, product.options, selection);
  const oldPrice =
    product.oldPrice && priceWithOptions(product.oldPrice, product.options, selection);
  const outOfStock = product.stock === 0;

  const handleOptionChange = (group, label) => {
    const next = new URLSearchParams(searchParams);
    next.set(group, label);
    setSearchParams(next, { replace: true, preventScrollReset: true });
  };

  const handleBuyNow = () => {
    actions.onAddToCart();
    navigate(PATHS.CHECKOUT);
  };

  return (
    <div className={styles.info}>
      <p className={styles.brand}>{product.brand}</p>
      <h1 className={styles.title}>{product.name}</h1>

      <div className={styles.meta}>
        <Rating value={product.rating} count={product.reviewsCount} />
        <ValueScore score={product.valueScore} />
        <StockBadge stock={product.stock} />
      </div>

      <div className={styles.priceBox}>
        <Price value={price} oldPrice={oldPrice} months={months} size="xl" showVat />
      </div>

      <ProductOptions
        options={product.options}
        selection={selection}
        onChange={handleOptionChange}
      />

      <InstallmentPicker price={price} value={months} onChange={setMonths} />

      <div className={styles.actions}>
        <Button size="xl" onClick={actions.onAddToCart} disabled={outOfStock}>
          {outOfStock ? t('productCard.outOfStock') : t('productCard.addToCart')}
        </Button>
        <Button variant="dark" size="xl" onClick={handleBuyNow} disabled={outOfStock}>
          {t('productDetails.buyNow')}
        </Button>
        <IconButton
          icon="compare"
          label={t('productCard.addToCompare')}
          pressed={actions.inCompare}
          onClick={actions.onToggleCompare}
        />
        <IconButton
          icon="heart"
          label={t('productCard.saveToWishlist')}
          pressed={actions.inWishlist}
          onClick={actions.onToggleWishlist}
        />
      </div>
    </div>
  );
}

export default ProductInfo;
