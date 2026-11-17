import { Link } from 'react-router-dom';

import styles from './Button.module.css';

/**
 * The store's button. Pass `to` to render a router link styled as a button (navigation),
 * otherwise it is a <button> (an action).
 * variant: primary | dark | outline | quiet | gold | inverse | link | danger
 * size: sm (40) | md (44) | lg (48) | xl (52)
 */
function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  to,
  type = 'button',
  disabled,
  className,
  children,
  ...rest
}) {
  const classes = [
    styles.button,
    styles[variant],
    size !== 'md' && styles[size],
    fullWidth && styles.fullWidth,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const content = (
    <>
      {loading && <span className={styles.spinner} aria-hidden="true" />}
      {children}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {content}
    </button>
  );
}

export default Button;
