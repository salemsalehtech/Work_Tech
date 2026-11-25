import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { DataState, EmptyState, Rating, Skeleton, Tabs } from '@shared/components/ui';

import { useGetReviewsQuery } from '../../api/catalogApi';
import { formatProductSpecs } from '../../model/formatSpecs';

import styles from './ProductSpecsTabs.module.css';

function SpecsPanel({ specs }) {
  const { t } = useTranslation('catalog');

  return (
    <dl className={styles.specsGrid}>
      {formatProductSpecs(specs, t).map(({ key, label, value }) => (
        <div key={key} className={styles.specRow}>
          <dt className={styles.specLabel}>{label}</dt>
          <dd className={styles.specValue}>
            <bdi>{value}</bdi>
          </dd>
        </div>
      ))}
    </dl>
  );
}

function BoxPanel({ items }) {
  return (
    <ul className={styles.boxList}>
      {items.map((item) => (
        <li key={item}>
          <bdi>{item}</bdi>
        </li>
      ))}
    </ul>
  );
}

function ReviewsPanel({ productId }) {
  const { t } = useTranslation('catalog');
  const result = useGetReviewsQuery(productId);

  return (
    <DataState
      result={result}
      loading={<Skeleton height={140} />}
      empty={
        <EmptyState
          title={t('productDetails.reviewsEmptyTitle')}
          text={t('productDetails.reviewsEmptyText')}
        />
      }
    >
      {(reviews) => (
        <ul className={styles.reviewsList}>
          {reviews.map((review) => (
            <li key={review.id} className={styles.reviewItem}>
              <div className={styles.reviewHead}>
                <div>
                  <h3 className={styles.reviewTitle}>{review.title}</h3>
                  <p className={styles.reviewAuthor}>
                    {review.userName} · {review.city}
                  </p>
                </div>
                <Rating value={review.rating} />
              </div>
              <p>{review.body}</p>
            </li>
          ))}
        </ul>
      )}
    </DataState>
  );
}

/** Specifications, In the box and Reviews of a laptop. The reviews load when their tab opens. */
function ProductSpecsTabs({ product }) {
  const { t } = useTranslation('catalog');
  const [tab, setTab] = useState('specs');

  return (
    <section className={styles.section}>
      <Tabs
        label={t('productDetails.tabs.label')}
        items={[
          { id: 'specs', label: t('productDetails.tabs.specs') },
          { id: 'inTheBox', label: t('productDetails.tabs.inTheBox') },
          {
            id: 'reviews',
            label: t('productDetails.tabs.reviews', { total: product.reviewsCount }),
          },
        ]}
        value={tab}
        onChange={setTab}
      >
        <div className={styles.panel}>
          {tab === 'specs' && <SpecsPanel specs={product.specs} />}
          {tab === 'inTheBox' && <BoxPanel items={product.inTheBox} />}
          {tab === 'reviews' && <ReviewsPanel productId={product.id} />}
        </div>
      </Tabs>
    </section>
  );
}

export default ProductSpecsTabs;
