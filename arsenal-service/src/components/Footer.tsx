import React from 'react';
import styles from '../styles/Footer.module.css';

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.section}>
          <h3>Контакты</h3>
          <p>АО "Арсенал КрЗПП"</p>
          <p>Адрес: [Адрес предприятия]</p>
          <p>Телефон: [Номер телефона]</p>
          <p>Email: info@arsenal-krzpp.ru</p>
        </div>
        <div className={styles.section}>
          <h3>Навигация</h3>
          <ul>
            <li><a href="/about">О компании</a></li>
            <li><a href="/products">Продукция</a></li>
            <li><a href="/technologies">Технологии</a></li>
            <li><a href="/contacts">Контакты</a></li>
          </ul>
        </div>
        <div className={styles.section}>
          <h3>Социальные сети</h3>
          <div className={styles.social}>
            <a href="#" target="_blank" rel="noopener noreferrer">VK</a>
            <a href="#" target="_blank" rel="noopener noreferrer">Telegram</a>
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