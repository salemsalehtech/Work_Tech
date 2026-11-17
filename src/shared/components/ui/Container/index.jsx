import styles from './Container.module.css';

/** Centred page column with the side gutters. width: default (1280) | narrow (1180) | slim (1080) */
function Container({ as: Tag = 'div', width = 'default', className, children, ...rest }) {
  const classes = [styles.container, width !== 'default' && styles[width], className]
    .filter(Boolean)
    .join(' ');

  return (
    <Tag className={classes} {...rest}>
      {children}
    </Tag>
  );
}

export default Container;
