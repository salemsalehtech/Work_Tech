import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { updateProfile } from '@features/auth';
import { Badge, Button, Checkbox, EmptyState, Icon, Input } from '@shared/components/ui';
import { isEgyptianMobile } from '@shared/utils';

import styles from './Account.module.css';

function AddressesSection({ user }) {
  const { t } = useTranslation('account');
  const dispatch = useDispatch();

  const addresses = Array.isArray(user?.addresses) ? user.addresses : [];

  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    city: '',
    address: '',
    isDefault: false,
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (success) setSuccess('');
  };

  const validate = () => {
    const nextErrors = {};
    const trimmedName = formData.fullName.trim();
    const trimmedPhone = formData.phone.trim();
    const trimmedCity = formData.city.trim();
    const trimmedAddress = formData.address.trim();

    if (!trimmedName) {
      nextErrors.fullName = t('addresses.validation.fullNameRequired');
    }

    if (!trimmedPhone) {
      nextErrors.phone = t('addresses.validation.phoneRequired');
    } else if (!isEgyptianMobile(trimmedPhone)) {
      nextErrors.phone = t('addresses.validation.phoneInvalid');
    }

    if (!trimmedCity) {
      nextErrors.city = t('addresses.validation.cityRequired');
    }

    if (!trimmedAddress) {
      nextErrors.address = t('addresses.validation.addressRequired');
    } else if (trimmedAddress.length < 10) {
      nextErrors.address = t('addresses.validation.addressMinLength');
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const trimmedName = formData.fullName.trim();
    const trimmedPhone = formData.phone.trim();
    const trimmedCity = formData.city.trim();
    const trimmedAddress = formData.address.trim();

    const makeDefault = formData.isDefault || addresses.length === 0;

    const newAddr = {
      id: `addr-${Date.now()}`,
      fullName: trimmedName,
      phone: trimmedPhone,
      city: trimmedCity,
      address: trimmedAddress,
      isDefault: makeDefault,
    };

    const nextAddresses = addresses.map((addr) =>
      makeDefault ? { ...addr, isDefault: false } : addr,
    );
    nextAddresses.push(newAddr);

    dispatch(updateProfile({ addresses: nextAddresses }));
    setIsAdding(false);
    setFormData({
      fullName: '',
      phone: '',
      city: '',
      address: '',
      isDefault: false,
    });
    setSuccess(t('addresses.successAdd'));
  };

  const handleDelete = (id) => {
    const nextAddresses = addresses
      .filter((addr) => addr.id !== id)
      .map((addr, idx) => {
        // If deleted address was default, set the first remaining address as default
        const wasDefault = addresses.find((a) => a.id === id)?.isDefault;
        if (wasDefault && idx === 0) {
          return { ...addr, isDefault: true };
        }
        return addr;
      });

    dispatch(updateProfile({ addresses: nextAddresses }));
    setSuccess(t('addresses.successDelete'));
  };

  const handleSetDefault = (id) => {
    const nextAddresses = addresses.map((addr) => ({
      ...addr,
      isDefault: addr.id === id,
    }));

    dispatch(updateProfile({ addresses: nextAddresses }));
    setSuccess(t('addresses.successDefault'));
  };

  return (
    <section className={styles.card} aria-labelledby="addresses-heading">
      <div className={styles.sectionHeaderWithAction}>
        <div>
          <h2 id="addresses-heading" className={styles.sectionTitle}>
            {t('addresses.title')}
          </h2>
          <p className={styles.sectionSubtitle}>{t('addresses.subtitle')}</p>
        </div>

        {!isAdding && addresses.length > 0 && (
          <Button variant="primary" size="sm" onClick={() => setIsAdding(true)}>
            {t('addresses.addNew')}
          </Button>
        )}
      </div>

      {success && (
        <div className={styles.alertSuccess} role="status" aria-live="polite">
          <Icon name="check" size={16} />
          <span>{success}</span>
        </div>
      )}

      {isAdding ? (
        <form onSubmit={handleAddSubmit} className={styles.form} noValidate>
          <div className={styles.formGrid}>
            <Input
              id="address-fullname"
              name="fullName"
              label={t('addresses.form.fullName')}
              placeholder={t('addresses.form.fullNamePlaceholder')}
              value={formData.fullName}
              onChange={(e) => handleFieldChange('fullName', e.target.value)}
              error={errors.fullName}
              required
            />

            <Input
              id="address-phone"
              name="phone"
              type="tel"
              label={t('addresses.form.phone')}
              placeholder={t('addresses.form.phonePlaceholder')}
              value={formData.phone}
              onChange={(e) => handleFieldChange('phone', e.target.value)}
              error={errors.phone}
              required
            />
          </div>

          <div className={styles.formGrid}>
            <Input
              id="address-city"
              name="city"
              label={t('addresses.form.city')}
              placeholder={t('addresses.form.cityPlaceholder')}
              value={formData.city}
              onChange={(e) => handleFieldChange('city', e.target.value)}
              error={errors.city}
              required
            />

            <Input
              id="address-line"
              name="address"
              label={t('addresses.form.address')}
              placeholder={t('addresses.form.addressPlaceholder')}
              value={formData.address}
              onChange={(e) => handleFieldChange('address', e.target.value)}
              error={errors.address}
              required
            />
          </div>

          <Checkbox
            label={t('addresses.form.setAsDefault')}
            checked={formData.isDefault}
            onChange={(e) => handleFieldChange('isDefault', e.target.checked)}
          />

          <div className={styles.formActions}>
            <Button type="submit" variant="primary">
              {t('addresses.saveAddress')}
            </Button>
            <Button
              type="button"
              variant="quiet"
              onClick={() => {
                setIsAdding(false);
                setErrors({});
              }}
            >
              {t('addresses.cancel')}
            </Button>
          </div>
        </form>
      ) : addresses.length === 0 ? (
        <EmptyState
          title={t('addresses.emptyTitle')}
          text={t('addresses.emptyText')}
          action={
            <Button variant="primary" onClick={() => setIsAdding(true)}>
              {t('addresses.addNew')}
            </Button>
          }
        />
      ) : (
        <div className={styles.addressGrid}>
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className={[styles.addressCard, addr.isDefault && styles.addressCardDefault]
                .filter(Boolean)
                .join(' ')}
              data-testid={`address-card-${addr.id}`}
            >
              <div>
                <div className={styles.addressCardHeader}>
                  <span className={styles.addressName}>{addr.fullName}</span>
                  {addr.isDefault && <Badge tone="blue">{t('addresses.defaultBadge')}</Badge>}
                </div>
                <p className={styles.addressPhone}>{addr.phone}</p>
                <p className={styles.addressLocation}>
                  {addr.city}, {addr.address}
                </p>
              </div>

              <div className={styles.addressActions}>
                {!addr.isDefault && (
                  <Button variant="quiet" size="sm" onClick={() => handleSetDefault(addr.id)}>
                    {t('addresses.setDefault')}
                  </Button>
                )}
                <Button
                  variant="quiet"
                  size="sm"
                  onClick={() => handleDelete(addr.id)}
                  aria-label={`${t('addresses.delete')} ${addr.fullName}`}
                >
                  {t('addresses.delete')}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default AddressesSection;
