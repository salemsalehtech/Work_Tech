import { nanoid } from '@reduxjs/toolkit';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { Badge, Button, ConfirmButton } from '@shared/components/ui';

import { updateProfile } from '../../authSlice';
import { addAddress, removeAddress, setDefaultAddress } from '../../model/addresses';
import AccountSection from '../AccountSection';
import AddressForm from '../AddressForm';

import styles from './AddressBook.module.css';

function AddressCard({ address, onMakeDefault, onRemove }) {
  const { t } = useTranslation('account');

  return (
    <li className={[styles.card, address.isDefault && styles.default].filter(Boolean).join(' ')}>
      <div className={styles.head}>
        <span className={styles.name}>{address.fullName}</span>
        {address.isDefault && <Badge>{t('addresses.default')}</Badge>}
      </div>
      {[address.phone, address.address, address.city].map((line) => (
        <span key={line}>
          <bdi>{line}</bdi>
        </span>
      ))}

      <div className={styles.actions}>
        {!address.isDefault && (
          <Button variant="link" onClick={onMakeDefault}>
            {t('addresses.makeDefault')}
          </Button>
        )}
        <ConfirmButton
          label={t('common:actions.remove')}
          name={t('addresses.remove', { address: address.address })}
          question={t('addresses.confirmRemove')}
          onConfirm={onRemove}
        />
      </div>
    </li>
  );
}

/** Saved addresses of the user: add, remove and choose the default. */
function AddressBook({ addresses }) {
  const { t } = useTranslation('account');
  const dispatch = useDispatch();
  const [adding, setAdding] = useState(false);
  const [message, setMessage] = useState('');

  const save = (nextAddresses, messageKey) => {
    dispatch(updateProfile({ addresses: nextAddresses }));
    setMessage(t(messageKey));
  };

  const handleAdd = (values) => {
    save(addAddress(addresses, { ...values, id: nanoid() }), 'addresses.added');
    setAdding(false);
  };

  return (
    <AccountSection title={t('addresses.title')} message={message}>
      <ul className={styles.grid}>
        {addresses.map((address) => (
          <AddressCard
            key={address.id}
            address={address}
            onMakeDefault={() =>
              save(setDefaultAddress(addresses, address.id), 'addresses.defaultChanged')
            }
            onRemove={() => save(removeAddress(addresses, address.id), 'addresses.removed')}
          />
        ))}
        {!adding && (
          <li>
            <button type="button" className={styles.add} onClick={() => setAdding(true)}>
              {t('addresses.add')}
            </button>
          </li>
        )}
      </ul>
      {adding && <AddressForm onSave={handleAdd} onCancel={() => setAdding(false)} />}
    </AccountSection>
  );
}

export default AddressBook;
