import styles from './Header.module.css';
import { NavLink } from 'react-router';

export default function Header({ title }) {

  return (
    <header>
      <h1 className={styles.mainTitle}>{title}</h1>
      <nav>
        <NavLink
          to={'/'}
          className={`${styles.navItem} ${(isActive) =>
            isActive ? styles.active : styles.inactive}
          `}
        >
          Home
        </NavLink>
        <NavLink
          to={'/about'}
          className={`${styles.navItem} ${(isActive) =>
            isActive ? styles.active : styles.inactive}
          `}
        >
          About
        </NavLink>
      </nav>
    </header>
  );
}
