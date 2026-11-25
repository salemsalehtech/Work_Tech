import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { ProductImage } from '@shared/components/ui';

import styles from './ProductGallery.module.css';

export function ProductGallery({ images = [], name = '' }) {
  const { t } = useTranslation('catalog');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const safeIndex = selectedIndex < images.length ? selectedIndex : 0;
  const activeSrc = images[safeIndex];

  return (
    <div className={styles.gallery}>
      <div className={styles.stage}>
        <ProductImage src={activeSrc} alt={name} className={styles.mainImage} />
      </div>

      {images.length > 1 && (
        <div className={styles.thumbs} role="group" aria-label={t('productDetails.galleryLabel')}>
          {images.map((src, index) => {
            const active = index === safeIndex;
            return (
              <button
                key={`${src}-${index}`}
                type="button"
                className={`${styles.thumb} ${active ? styles.active : ''}`}
                aria-label={t('productDetails.thumbnailAlt', { name, index: index + 1 })}
                aria-pressed={active}
                onClick={() => setSelectedIndex(index)}
              >
                <ProductImage src={src} alt="" className={styles.thumbImage} />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ProductGallery;
