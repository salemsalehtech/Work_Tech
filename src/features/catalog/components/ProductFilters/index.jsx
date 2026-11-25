import { useId, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, Checkbox, ChoiceList, FilterGroup, Input, Toggle } from '@shared/components/ui';

import { MULTI_FILTERS, RATING_VALUES } from '../../model/filterOptions';

import styles from './ProductFilters.module.css';

/** Keeps the typed price local, and writes it to the URL on blur or Enter. */
function PriceInput({ id, label, placeholder, value, onCommit }) {
  const [draft, setDraft] = useState(value);

  const commit = () => {
    if (draft !== value) onCommit(draft);
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
      onChange={(event) => setDraft(event.target.value)}
      onBlur={commit}
      onKeyDown={(event) => {
        if (event.key === 'Enter') commit();
      }}
    />
  );
}

function MultiFilter({ filter, values, onChange }) {
  const { t } = useTranslation('catalog');
  const toggle = (value) =>
    onChange(values.includes(value) ? values.filter((item) => item !== value) : [...values, value]);

  return (
    <FilterGroup title={t(`filters.${filter.key}`)}>
      {filter.options.map((option) => (
        <Checkbox
          key={option.value}
          label={option.label ?? t(option.labelKey, option.labelValues)}
          checked={values.includes(option.value)}
          onChange={() => toggle(option.value)}
        />
      ))}
    </FilterGroup>
  );
}

/** The catalog filters: the sidebar on desktop, inside a Drawer below 1200px, which name them. */
function ProductFilters({
  filters,
  activeCount,
  onMultiChange,
  onSingleChange,
  onPriceChange,
  onClearAll,
}) {
  const { t } = useTranslation('catalog');
  const baseId = useId();
  const [brand, ...specFilters] = MULTI_FILTERS;

  const multiFilter = (filter) => (
    <MultiFilter
      key={filter.key}
      filter={filter}
      values={filters[filter.key]}
      onChange={(values) => onMultiChange(filter.key, values)}
    />
  );

  return (
    <div>
      {activeCount > 0 && (
        <Button variant="link" onClick={onClearAll}>
          {t('filters.clearAll')}
        </Button>
      )}

      {multiFilter(brand)}

      <FilterGroup title={t('filters.price')}>
        <div className={styles.priceRow}>
          <PriceInput
            key={`min-${filters.min}`}
            id={`${baseId}-min`}
            label={t('filters.minPrice')}
            placeholder="0"
            value={filters.min}
            onCommit={(min) => onPriceChange(min, filters.max)}
          />
          <PriceInput
            key={`max-${filters.max}`}
            id={`${baseId}-max`}
            label={t('filters.maxPrice')}
            placeholder="150000"
            value={filters.max}
            onCommit={(max) => onPriceChange(filters.min, max)}
          />
        </div>
      </FilterGroup>

      {specFilters.map(multiFilter)}

      <FilterGroup title={t('filters.rating')}>
        <ChoiceList
          options={RATING_VALUES.map((rating) => ({
            value: rating,
            label: rating ? t('filters.ratingUp', { rating }) : t('filters.anyRating'),
          }))}
          value={filters.rating}
          onChange={(rating) => onSingleChange('rating', rating)}
        />
      </FilterGroup>

      <div className={styles.stockRow}>
        <Toggle
          id={`${baseId}-stock`}
          label={t('filters.inStockOnly')}
          checked={filters.inStock}
          onChange={(checked) => onSingleChange('inStock', checked ? '1' : '')}
        />
      </div>
    </div>
  );
}

export default ProductFilters;
