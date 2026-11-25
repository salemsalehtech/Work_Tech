import { useTranslation } from 'react-i18next';

import { Button, Checkbox, Input } from '@shared/components/ui';
import { useForm } from '@shared/hooks';

import { validateAddress } from '../../model/validation';

import styles from './AddressForm.module.css';

const INITIAL_VALUES = { fullName: '', phone: '', city: '', address: '', isDefault: false };

function AddressForm({ onSave, onCancel }) {
  const { t } = useTranslation('account');
  const form = useForm({ initialValues: INITIAL_VALUES, validate: validateAddress });

  const fieldProps = (name) => ({
    id: `address-${name}`,
    label: t(`fields.${name}`),
    error: form.errorOf(name) && t(`errors.${form.errorOf(name)}`),
    ...form.field(name),
  });

  return (
    <form className={styles.form} onSubmit={form.handleSubmit(onSave)} noValidate>
      <Input {...fieldProps('fullName')} autoComplete="name" />
      <Input {...fieldProps('phone')} type="tel" autoComplete="tel" />
      <Input {...fieldProps('city')} autoComplete="address-level1" />
      <Input {...fieldProps('address')} autoComplete="street-address" />
      <div className={styles.wide}>
        <Checkbox
          label={t('addresses.makeDefault')}
          checked={form.values.isDefault}
          onChange={(event) => form.setValue('isDefault', event.target.checked)}
        />
      </div>
      <div className={[styles.wide, styles.actions].join(' ')}>
        <Button type="submit">{t('addresses.save')}</Button>
        <Button variant="quiet" onClick={onCancel}>
          {t('common:actions.cancel')}
        </Button>
      </div>
    </form>
  );
}

export default AddressForm;
