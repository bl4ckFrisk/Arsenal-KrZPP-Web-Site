import React from 'react';
import Link from 'next/link';
import styles from '../styles/Header.module.css';

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Link href="/">
          <img src="/logo.svg" alt="Арсенал КрЗПП" />
        </Link>
      </div>
      <nav className={styles.nav}>
        <Link href="/about">О компании</Link>
        <Link href="/products">Продукция</Link>
        <Link href="/technologies">Технологии</Link>
        <Link href="/contacts">Контакты</Link>
        <Link href="/careers">Карьера</Link>
      </nav>
    </header>
  );
};

export default Header; 