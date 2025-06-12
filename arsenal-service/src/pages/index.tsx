import React from 'react';
import Layout from '../components/Layout';
import styles from '../styles/Home.module.css';

const Home: React.FC = () => {
  return (
    <Layout>
      <div className={styles.hero}>
        <h1>АО "Арсенал КрЗПП"</h1>
        <p>Ведущий производитель полупроводниковых приборов</p>
      </div>

      <section className={styles.features}>
        <div className={styles.feature}>
          <h2>Инновации</h2>
          <p>Современные технологии и инновационные решения в производстве полупроводников</p>
        </div>
        <div className={styles.feature}>
          <h2>Качество</h2>
          <p>Высокие стандарты качества и надежности продукции</p>
        </div>
        <div className={styles.feature}>
          <h2>Опыт</h2>
          <p>Многолетний опыт в разработке и производстве полупроводниковых приборов</p>
        </div>
      </section>

      <section className={styles.products}>
        <h2>Наша продукция</h2>
        <div className={styles.productGrid}>
          <div className={styles.productCard}>
            <h3>Диоды</h3>
            <p>Широкий спектр полупроводниковых диодов различного назначения</p>
          </div>
          <div className={styles.productCard}>
            <h3>Транзисторы</h3>
            <p>Биполярные и полевые транзисторы для различных применений</p>
          </div>
          <div className={styles.productCard}>
            <h3>Микросхемы</h3>
            <p>Интегральные микросхемы специального назначения</p>
          </div>
        </div>
      </section>

      <section className={styles.cta}>
        <h2>Заинтересованы в сотрудничестве?</h2>
        <p>Свяжитесь с нами для обсуждения ваших потребностей</p>
        <a href="/contacts" className={styles.button}>Связаться с нами</a>
      </section>
    </Layout>
  );
};

export default Home; 