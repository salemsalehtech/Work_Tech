import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

import { clearAuthError, selectCurrentUser } from '@features/auth';
import { Container } from '@shared/components/ui';

import styles from './Auth.module.css';
import CreateAccount from './CreateAccount';
import DemoCredentials from './DemoCredentials';
import PasswordInput from './PasswordInput';
import { getRedirectPath } from './redirectUtils';
import SignIn from './SignIn';

/**
 * Auth Page: Provides Sign In and Create Account experiences.
 * Supports URL parameter `?mode=register` or tabs to switch between modes,
 * validates user inputs, integrates with AB-01 authentication, displays demo
 * credentials, and safely redirects to `location.state.from` (or Account page)
 * upon successful authentication.
 */
function Auth() {
  const { t } = useTranslation('account');
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentUser = useSelector(selectCurrentUser);

  const mode = searchParams.get('mode') === 'register' ? 'register' : 'signin';

  // Redirect if already authenticated
  useEffect(() => {
    if (currentUser) {
      const destination = getRedirectPath(location.state);
      navigate(destination, { replace: true });
    }
  }, [currentUser, location.state, navigate]);

  const handleSwitchMode = (nextMode) => {
    dispatch(clearAuthError());
    const nextParams = new URLSearchParams(searchParams);
    if (nextMode === 'register') {
      nextParams.set('mode', 'register');
    } else {
      nextParams.delete('mode');
    }
    setSearchParams(nextParams, { state: location.state });
  };

  const handleAuthSuccess = () => {
    const destination = getRedirectPath(location.state);
    navigate(destination, { replace: true });
  };

  return (
    <div className={styles.page}>
      <Container width="narrow">
        <div className={styles.card}>
          <div className={styles.header}>
            <h1 className={styles.title}>
              {mode === 'signin' ? t('auth.signInTitle') : t('auth.createAccountTitle')}
            </h1>
            <p className={styles.subtitle}>
              {mode === 'signin' ? t('auth.signInSubtitle') : t('auth.createAccountSubtitle')}
            </p>
          </div>

          <div className={styles.tabs} role="tablist" aria-label={t('auth.title')}>
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'signin'}
              className={[styles.tab, mode === 'signin' && styles.tabActive]
                .filter(Boolean)
                .join(' ')}
              onClick={() => handleSwitchMode('signin')}
            >
              {t('auth.signInTab')}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'register'}
              className={[styles.tab, mode === 'register' && styles.tabActive]
                .filter(Boolean)
                .join(' ')}
              onClick={() => handleSwitchMode('register')}
            >
              {t('auth.createAccountTab')}
            </button>
          </div>

          {mode === 'signin' ? (
            <SignIn
              onSwitchToRegister={() => handleSwitchMode('register')}
              onSignInSuccess={handleAuthSuccess}
            />
          ) : (
            <CreateAccount
              onSwitchToSignIn={() => handleSwitchMode('signin')}
              onRegisterSuccess={handleAuthSuccess}
            />
          )}
        </div>
      </Container>
    </div>
  );
}

export { CreateAccount, DemoCredentials, PasswordInput, SignIn };
export default Auth;
