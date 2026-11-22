import { useId, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, ChoiceList, FilterGroup, Input, Toggle } from '@shared/components/ui';

import { BRAND_OPTIONS, RAM_OPTIONS, RATING_VALUES } from '../../model/filterOptions';

import styles from './ProductFilters.module.css';

function PriceInput({ id, label, placeholder, value, onCommit }) {
  const [draft, setDraft] = useState(value);

  const commit = () => {
    if (draft !== value) {
      onCommit(draft);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      commit();
    }
  };

  return (
    <Input
      id={id}
      label={label}
      type="number"
      min="0"
      inputMode="numeric"
      placeholder={placeholder}
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={commit}
      onKeyDown={handleKeyDown}
    />
  );
}

export function ProductFilters({
  filters,
  activeCount,
  onMultiChange,
  onSingleChange,
  onPriceChange,
  onClearAll,
}) {
  const { t } = useTranslation('catalog');
  const stockId = useId();
  const minId = useId();
  const maxId = useId();

  const ramOptions = RAM_OPTIONS.map((ram) => ({
    value: ram,
    label: t('filters.ramOption', { ram }),
  }));

  const ratingOptions = RATING_VALUES.map((val) => ({
    value: val,
    label: val ? t('filters.ratingUp', { rating: val }) : t('filters.anyRating'),
  }));

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h2 className={styles.heading}>{t('filters.title')}</h2>
        {activeCount > 0 && (
          <Button variant="ghost" size="sm" onClick={onClearAll}>
            {t('filters.clearAll')}
          </Button>
        )}
      </div>

      <FilterGroup title={t('filters.brand')}>
        <ChoiceList
          legend={t('filters.brand')}
          options={BRAND_OPTIONS}
          value={filters.brands}
          onChange={(vals) => onMultiChange('brand', vals)}
          multiple
        />
      </FilterGroup>

      <FilterGroup title={t('filters.price')}>
        <div className={styles.priceRow}>
          <PriceInput
            key={`min-${filters.min}`}
            id={minId}
            label={t('filters.minPrice')}
            placeholder="0"
            value={filters.min}
            onCommit={(nextMin) => onPriceChange(nextMin, filters.max)}
          />
          <PriceInput
            key={`max-${filters.max}`}
            id={maxId}
            label={t('filters.maxPrice')}
            placeholder="150000"
            value={filters.max}
            onCommit={(nextMax) => onPriceChange(filters.min, nextMax)}
          />
        </div>
      </FilterGroup>

      <FilterGroup title={t('filters.memory')}>
        <ChoiceList
          legend={t('filters.memory')}
          options={ramOptions}
          value={filters.rams}
          onChange={(vals) => onMultiChange('ram', vals)}
          multiple
        />
      </FilterGroup>

      <FilterGroup title={t('filters.rating')}>
        <ChoiceList
          legend={t('filters.rating')}
          options={ratingOptions}
          value={filters.rating}
          onChange={(val) => onSingleChange('rating', val)}
        />
      </FilterGroup>

      <div className={styles.stockRow}>
        <Toggle
          id={stockId}
          label={t('filters.inStockOnly')}
          checked={filters.inStock}
          onChange={(checked) => onSingleChange('inStock', checked ? '1' : '')}
        />
      </div>
    </div>
  );
}

export default ProductFilters;
