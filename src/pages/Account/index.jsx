import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import {
  AccountLayout,
  AddressBook,
  NotificationSettings,
  ProfileForm,
  selectCurrentUser,
} from '@features/auth';

function Account() {
  const { t } = useTranslation('account');
  const user = useSelector(selectCurrentUser);

  return (
    <AccountLayout title={t('page.greeting', { name: user.fullName.split(' ')[0] })}>
      <ProfileForm user={user} />
      <AddressBook addresses={user.addresses} />
      <NotificationSettings notifications={user.notifications} />
    </AccountLayout>
  );
}

export default Account;
