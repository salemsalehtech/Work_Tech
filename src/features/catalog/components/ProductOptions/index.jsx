import { useTranslation } from 'react-i18next';

import { ChoiceList, OptionCards } from '@shared/components/ui';
import { formatPrice } from '@shared/utils';

import styles from './ProductOptions.module.css';

/** Memory, storage and warranty of a laptop. selection is { memory, storage, warranty } labels. */
function ProductOptions({ options, selection, onChange }) {
  const { t, i18n } = useTranslation('catalog');

  const choicesOf = (group) =>
    options[group].map(({ label, delta }) => ({
      value: label,
      label,
      aside: delta === 0 ? t('options.included') : `+${formatPrice(delta, i18n.language)}`,
    }));

  return (
    <div className={styles.options}>
      {Object.keys(options).map((group) => {
        const Choices = group === 'warranty' ? ChoiceList : OptionCards;
        return (
          <Choices
            key={group}
            legend={t(`options.${group}`)}
            options={choicesOf(group)}
            value={selection[group]}
            onChange={(label) => onChange(group, label)}
          />
        );
      })}
    </div>
  );
}

export default ProductOptions;
