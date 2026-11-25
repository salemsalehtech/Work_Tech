import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Navigate, useLocation, useSearchParams } from 'react-router-dom';

import { CreateAccountForm, selectCurrentUser, SignInForm, WelcomePanel } from '@features/auth';
import { SegmentedControl } from '@shared/components/ui';

import styles from './Auth.module.css';
import { redirectPath } from './redirectPath';

/** Sign in and Create account (/auth?mode=register). Signed-in users go back to where they came from. */
function Auth() {
  const { t } = useTranslation('account');
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const user = useSelector(selectCurrentUser);
  const mode = searchParams.get('mode') === 'register' ? 'register' : 'signIn';

  if (user) return <Navigate to={redirectPath(location.state)} replace />;

  return (
    <div className={styles.split}>
      <WelcomePanel />
      <div className={styles.side}>
        <div className={styles.column}>
          <SegmentedControl
            fullWidth
            ariaLabel={t('mode.label')}
            options={[
              { value: 'signIn', label: t('mode.signIn') },
              { value: 'register', label: t('mode.register') },
            ]}
            value={mode}
            onChange={(next) =>
              setSearchParams(next === 'register' ? { mode: next } : {}, {
                state: location.state,
                replace: true,
              })
            }
          />
          <div>
            <h1 className={styles.title}>{t(`${mode}.title`)}</h1>
            <p className={styles.text}>{t(`${mode}.text`)}</p>
          </div>
          {mode === 'register' ? <CreateAccountForm /> : <SignInForm />}
        </div>
      </div>
    </div>
  );
}

export default Auth;
