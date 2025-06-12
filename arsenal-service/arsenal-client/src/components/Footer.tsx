import React from 'react';
import Link from 'next/link';
import styles from '../styles/Footer.module.css';

const Footer = (): JSX.Element => {
  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <div className={styles.company}>
          <h3>АО "Арсенал КрЗПП"</h3>
          <p>Ведущий производитель полупроводниковых приборов</p>
        </div>
        <div className={styles.links}>
          <div className={styles.section}>
            <h4>Навигация</h4>
            <Link href="/about">О компании</Link>
            <Link href="/products">Продукция</Link>
            <Link href="/technologies">Технологии</Link>
            <Link href="/contacts">Контакты</Link>
            <Link href="/careers">Карьера</Link>
          </div>
          <div className={styles.section}>
            <h4>Контакты</h4>
            <p>Адрес: [Адрес предприятия]</p>
            <p>Телефон: [Номер телефона]</p>
            <p>Email: [Email адрес]</p>
          </div>
        </div>
      </div>
      <div className={styles.bottom}>
        <p>&copy; {new Date().getFullYear()} АО "Арсенал КрЗПП". Все права защищены.</p>
      </div>
    </footer>
  );
};

export default Footer; 