import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { addItem } from '@features/cart';
import { ProductGallery, ProductSpecsTabs, useGetProductQuery } from '@features/catalog';
import { selectCompareIds } from '@features/compare';
import { selectWishlistItems } from '@features/wishlist';
import {
  Badge,
  Breadcrumbs,
  Button,
  Container,
  DataState,
  EmptyState,
  IconButton,
  InstallmentPicker,
  OptionCards,
  Price,
  Rating,
  Skeleton,
  ValueScore,
} from '@shared/components/ui';
import { DEFAULT_INSTALLMENT_MONTHS, LOW_STOCK_AT, PATHS } from '@shared/constants';
import { priceWithOptions } from '@shared/utils';

import { specsLine } from '../../features/catalog/components/ProductCard/specsLine';

import styles from './ProductDetails.module.css';

const OPTION_KEYS = ['memory', 'storage', 'warranty'];

function resolveSelection(options = {}, searchParams, userSelection) {
  const result = {};
  for (const key of OPTION_KEYS) {
    const list = options[key] ?? [];
    if (!list.length) continue;

    const fromUser = userSelection?.[key];
    const fromUrl = searchParams.get(key);
    const validUrl = list.some((opt) => opt.label === fromUrl) ? fromUrl : '';

    result[key] = fromUser || validUrl || list[0].label;
  }
  return result;
}

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

function ProductDetails() {
  const { id } = useParams();
  const { t } = useTranslation('catalog');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [userSelection, setUserSelection] = useState(null);
  const mountedProductRef = useRef(null);

  const rawResult = useGetProductQuery(id);
  const wishlist = useSelector(selectWishlistItems);
  const compareIds = useSelector(selectCompareIds);

  const isNotFound = rawResult.error?.status === 404;
  const result = {
    ...rawResult,
    isError: rawResult.isError && !isNotFound,
    data: isNotFound ? null : rawResult.data,
  };

  const handleOptionCardsChange = ({ selectedOptions }) => {
    if (mountedProductRef.current !== id) {
      mountedProductRef.current = id;
      return;
    }

    const nextSelection = {};
    for (const key of OPTION_KEYS) {
      if (selectedOptions[key]?.label) {
        nextSelection[key] = selectedOptions[key].label;
      }
    }

    setUserSelection(nextSelection);
    const nextParams = new URLSearchParams(searchParams);
    for (const [key, label] of Object.entries(nextSelection)) {
      nextParams.set(key, label);
    }
    setSearchParams(nextParams, { replace: true });
  };

  return (
    <Container className={styles.page}>
      <DataState
        result={result}
        loading={<ProductDetailsSkeleton />}
        empty={
          <EmptyState
            title={t('productDetails.notFoundTitle')}
            text={t('productDetails.notFoundText')}
            action={
              <Button to={PATHS.PRODUCTS} variant="secondary">
                {t('productDetails.backToProducts')}
              </Button>
            }
          />
        }
      >
        {(product) => {
          const selection = resolveSelection(product.options, searchParams, userSelection);
          const finalPrice = priceWithOptions(product.price, product.options, selection);
          const warrantyDelta =
            product.options?.warranty?.find((opt) => opt.label === selection.warranty)?.delta ?? 0;
          const outOfStock = product.stock === 0;
          const inWishlist = wishlist.some((item) => item.productId === product.id);
          const inCompare = compareIds.includes(product.id);

          const buildCartPayload = () => ({
            productId: product.id,
            kind: 'laptop',
            name: product.name,
            brand: product.brand,
            image: product.images?.[0] ?? '',
            specsLine: product.specs ? specsLine(product.specs) : '',
            price: finalPrice,
            warrantyDelta,
            options: selection,
            quantity: 1,
            stock: product.stock,
          });

          const handleAddToCart = () => dispatch(addItem(buildCartPayload()));
          const handleBuyNow = () => {
            dispatch(addItem(buildCartPayload()));
            navigate(PATHS.CHECKOUT);
          };
          const handleToggleWishlist = () =>
            dispatch({
              type: 'wishlist/toggleWishlist',
              payload: { productId: product.id, savedPrice: finalPrice },
            });
          const handleToggleCompare = () =>
            dispatch({ type: 'compare/toggleCompare', payload: product.id });

          const breadcrumbItems = [
            { label: t('productDetails.breadcrumbHome'), to: PATHS.HOME },
            { label: t('products.title'), to: PATHS.PRODUCTS },
            { label: product.name },
          ];

          return (
            <>
              <div className={styles.breadcrumbs}>
                <Breadcrumbs items={breadcrumbItems} />
              </div>

              <div className={styles.grid}>
                <ProductGallery key={product.id} images={product.images} name={product.name} />

                <div className={styles.info}>
                  <p className={styles.brand}>{product.brand}</p>
                  <h1 className={styles.title}>{product.name}</h1>

                  <div className={styles.meta}>
                    <Rating value={product.rating} count={product.reviewsCount} />
                    <ValueScore score={product.valueScore} />
                    <Badge tone={outOfStock ? 'sale' : 'success'}>
                      {outOfStock
                        ? t('productCard.outOfStock')
                        : product.stock <= LOW_STOCK_AT
                          ? t('productCard.onlyLeft', { count: product.stock })
                          : t('productDetails.inStock')}
                    </Badge>
                  </div>

                  <div className={styles.priceBox}>
                    <Price
                      value={finalPrice}
                      oldPrice={product.oldPrice}
                      months={DEFAULT_INSTALLMENT_MONTHS}
                      size="lg"
                    />
                  </div>

                  <OptionCards
                    key={product.id}
                    productId={product.id}
                    onChange={handleOptionCardsChange}
                  />

                  <InstallmentPicker price={finalPrice} />

                  <div className={styles.actions}>
                    <Button onClick={handleAddToCart} disabled={outOfStock}>
                      {outOfStock ? t('productCard.outOfStock') : t('productCard.addToCart')}
                    </Button>

                    <Button variant="secondary" onClick={handleBuyNow} disabled={outOfStock}>
                      {t('productDetails.buyNow')}
                    </Button>

                    <IconButton
                      icon="compare"
                      label={t('productCard.addToCompare')}
                      pressed={inCompare}
                      onClick={handleToggleCompare}
                    />

                    <IconButton
                      icon="heart"
                      label={t('productCard.saveToWishlist')}
                      pressed={inWishlist}
                      onClick={handleToggleWishlist}
                    />
                  </div>
                </div>
              </div>

              <ProductSpecsTabs product={product} />
            </>
          );
        }}
      </DataState>
    </Container>
  );
}

export default ProductDetails;
