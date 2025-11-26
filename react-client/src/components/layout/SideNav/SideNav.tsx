'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './SideNav.module.css';

export default function SideNav() {
  const pathname = usePathname();

  const navItems = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/dashboard/component1', label: 'Component 1' },
    { href: '/dashboard/component2', label: 'Component 2' },
    { href: '/dashboard/component3', label: 'Component 3' },
    { href: '/dashboard/component4', label: 'Component 4' },
    { href: '/dashboard/component5', label: 'Component 5' },
  ];

  return (
    <nav className={styles.sideNav}>
      <ul className={styles.navList}>
        {navItems.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={`${styles.navLink} ${
                pathname === item.href ? styles.active : ''
              }`}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

