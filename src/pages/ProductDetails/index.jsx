import { useTranslation } from 'react-i18next';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import {
  ProductGallery,
  ProductOptions,
  useGetProductQuery,
  useProductCardActions,
} from '@features/catalog';
import {
  Badge,
  Breadcrumbs,
  Button,
  Container,
  DataState,
  EmptyState,
  IconButton,
  Price,
  Rating,
  Skeleton,
  ValueScore,
} from '@shared/components/ui';
import { DEFAULT_INSTALLMENT_MONTHS, LOW_STOCK_AT, PATHS } from '@shared/constants';
import { priceWithOptions, resolveSelection } from '@shared/utils';

import styles from './ProductDetails.module.css';

function ProductDetailsSkeleton() {
  return (
    <div className={styles.grid} aria-busy="true">
      <Skeleton height={420} />
      <div className={styles.info}>
        <Skeleton height={36} />
        <Skeleton height={48} />
        <Skeleton height={220} />
      </div>
    </div>
  );
}

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

  const selection = resolveSelection(product.options, Object.fromEntries(searchParams));
  const actions = actionsOf(product, { selection });
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
        <Price
          value={priceWithOptions(product.price, product.options, selection)}
          oldPrice={product.oldPrice}
          months={DEFAULT_INSTALLMENT_MONTHS}
          size="xl"
          showVat
        />
      </div>

      <ProductOptions
        options={product.options}
        selection={selection}
        onChange={handleOptionChange}
      />

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

function ProductDetails() {
  const { id } = useParams();
  const { t } = useTranslation('catalog');
  const result = useGetProductQuery(id);

  const notFound = (
    <EmptyState
      title={t('productDetails.notFoundTitle')}
      text={t('productDetails.notFoundText')}
      action={
        <Button to={PATHS.PRODUCTS} variant="outline">
          {t('productDetails.backToProducts')}
        </Button>
      }
    />
  );

  return (
    <Container className={styles.page}>
      <DataState
        result={result}
        loading={<ProductDetailsSkeleton />}
        empty={notFound}
        error={result.error?.status === 404 ? notFound : undefined}
      >
        {(product) => (
          <>
            <div className={styles.breadcrumbs}>
              <Breadcrumbs
                items={[
                  { label: t('productDetails.breadcrumbHome'), to: PATHS.HOME },
                  { label: t('products.title'), to: PATHS.PRODUCTS },
                  { label: product.name },
                ]}
              />
            </div>
            <div className={styles.grid}>
              <ProductGallery key={product.id} images={product.images} name={product.name} />
              <ProductInfo product={product} />
            </div>
          </>
        )}
      </DataState>
    </Container>
  );
}

export default ProductDetails;
