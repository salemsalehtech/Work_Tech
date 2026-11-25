import { useTranslation } from 'react-i18next';

import { DataState, EmptyState, Rating, Skeleton, Tabs } from '@shared/components/ui';

import { useGetReviewsQuery } from '../../api/catalogApi';
import { formatProductSpecs } from '../../model/formatSpecs';

import styles from './ProductSpecsTabs.module.css';

function ReviewsPanel({ productId }) {
  const { t } = useTranslation('catalog');
  const reviewsResult = useGetReviewsQuery(productId);

  return (
    <DataState
      result={reviewsResult}
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
              <p className={styles.reviewBody}>{review.body}</p>
            </li>
          ))}
        </ul>
      )}
    </DataState>
  );
}

export function ProductSpecsTabs({ product }) {
  const { t } = useTranslation('catalog');
  const specRows = formatProductSpecs(product.specs, t);
  const boxItems = product.inTheBox ?? [];

  const tabs = [
    {
      label: t('productDetails.tabs.specs'),
      content: (
        <dl className={styles.specsGrid}>
          {specRows.map(({ key, label, value }) => (
            <div key={key} className={styles.specRow}>
              <dt className={styles.specLabel}>{label}</dt>
              <dd className={styles.specValue}>
                <bdi>{value}</bdi>
              </dd>
            </div>
          ))}
        </dl>
      ),
    },
    {
      label: t('productDetails.tabs.inTheBox'),
      content: (
        <ul className={styles.boxList}>
          {boxItems.map((item) => (
            <li key={item} className={styles.boxItem}>
              {item}
            </li>
          ))}
        </ul>
      ),
    },
    {
      label: t('productDetails.tabs.reviews', { count: product.reviewsCount ?? 0 }),
      content: <ReviewsPanel productId={product.id} />,
    },
  ];

  return (
    <section className={styles.section}>
      <Tabs
        id="product-details-tabs"
        tabs={tabs}
        navClassName={styles.tabList}
        tabClassName={styles.tabButton}
        activeTab={styles.activeTab}
      />
    </section>
  );
}

export default ProductSpecsTabs;
