import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import {
  Badge,
  Button,
  IconButton,
  Price,
  ProductImage,
  Rating,
  ValueScore,
} from '@shared/components/ui';
import { DEFAULT_INSTALLMENT_MONTHS, LOW_STOCK_AT, productPath } from '@shared/constants';
import { discountPercent } from '@shared/utils';

import { getProductTag } from '../../model/productTags';

import styles from './ProductCard.module.css';
import { specsLine } from './specsLine';

/**
 * The laptop tile of every product grid (Home, Products, Search, Wishlist, 404).
 * It only shows data and reports clicks: the caller connects cart, wishlist and compare.
 *
 * variant: catalog (default, with the rating row) | home (bigger, no rating row)
 * tag: optional { label, tone } badge when there is no discount; defaults to the product's first tag
 */
function ProductCard({
  product,
  variant = 'catalog',
  tag,
  inWishlist = false,
  inCompare = false,
  onAddToCart,
  onToggleWishlist,
  onToggleCompare,
}) {
  const { t } = useTranslation('catalog');
  const { id, brand, name, price, oldPrice, images, rating, reviewsCount, stock, valueScore } =
    product;
  const off = discountPercent(price, oldPrice);
  const outOfStock = stock === 0;
  const isHome = variant === 'home';

  const mappedTag = !tag ? getProductTag(product.tags) : null;
  const resolvedTag =
    tag ?? (mappedTag ? { label: t(mappedTag.labelKey), tone: mappedTag.tone } : null);

  return (
    <article className={[styles.card, isHome && styles.home].filter(Boolean).join(' ')}>
      <div className={styles.media}>
        <ProductImage className={styles.image} src={images?.[0]} />
        {off > 0 ? (
          <Badge tone="sale" className={styles.badge}>
            −{off}%
          </Badge>
        ) : (
          resolvedTag && (
            <Badge tone={resolvedTag.tone} className={styles.badge}>
              {resolvedTag.label}
            </Badge>
          )
        )}
        <IconButton
          icon="heart"
          size="sm"
          className={styles.favorite}
          label={t('productCard.saveToWishlist')}
          pressed={inWishlist}
          onClick={onToggleWishlist}
        />
      </div>

      <div className={styles.body}>
        <div className={styles.top}>
          <span className={styles.brand}>{brand}</span>
          <ValueScore score={valueScore} />
        </div>

        <Link to={productPath(id)} className={styles.name}>
          {name}
        </Link>

        {!isHome && (
          <div className={styles.meta}>
            <Rating value={rating} count={reviewsCount} />
            {stock <= LOW_STOCK_AT && (
              <span className={styles.stock}>
                {outOfStock
                  ? t('productCard.outOfStock')
                  : t('productCard.onlyLeft', { count: stock })}
              </span>
            )}
          </div>
        )}

        <span className={styles.specs}>
          <bdi>{specsLine(product.specs)}</bdi>
        </span>

        <div className={styles.price}>
          <Price
            value={price}
            oldPrice={oldPrice}
            months={DEFAULT_INSTALLMENT_MONTHS}
            size={isHome ? 'md' : 'sm'}
            monthsLabel={isHome ? t('common:price.months') : undefined}
          />
        </div>

        <div className={styles.actions}>
          <Button onClick={onAddToCart} disabled={outOfStock}>
            {outOfStock ? t('productCard.outOfStock') : t('productCard.addToCart')}
          </Button>
          <IconButton
            icon="compare"
            label={t('productCard.addToCompare')}
            pressed={inCompare}
            onClick={onToggleCompare}
          />
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
