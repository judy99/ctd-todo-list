import styles from './Header.module.css';
import { NavLink } from 'react-router';

export default function Header({ title }) {
  const checkActive = (el) => {
    if (el.isActive) return `${styles.navItem} ${styles.active} `;
    return `${styles.navItem} ${styles.inactive}`;
  };

  return (
    <header>
      <h1 className={styles.mainTitle}>{title}</h1>
      <nav>
        <NavLink
          to={'/'}
          className={(el) => checkActive(el)}
        >
          Home
        </NavLink>
        <NavLink
          to={'/about'}
          className={(el) => checkActive(el)}
        >
          About
        </NavLink>
      </nav>
    </header>
  );
}
