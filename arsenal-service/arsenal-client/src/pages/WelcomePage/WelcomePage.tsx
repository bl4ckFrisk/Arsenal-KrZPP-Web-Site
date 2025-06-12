import React from 'react';
import { Link } from 'react-router-dom';
import styles from './WelcomePage.module.css';
import { PhotoSlideshow } from '../../components/PhotoSlideshow/PhotoSlideshow';

export const WelcomePage: React.FC = () => {

  return (
    <div className={styles.welcomePage}>
      {/* Header Navigation */}
      <header className={styles.header}>
        <div className={styles.container}>
          <div className={styles.logo}>
            <h2>АО "Арсенал" КрЗПП</h2>
            <span>Краснознаменский завод полупроводниковых приборов</span>
          </div>
          <nav className={styles.nav}>
            <div className={styles.phone}>+7 495 589-92-66</div>
          </nav>
        </div>
      </header>

      {/* Main Company Information Section */}
      <section className={styles.mainCompany}>
        <div className={styles.liquidGlassBg}></div>
        <div className={styles.container}>
          <div className={styles.mainContent}>
            <h1 className={styles.mainTitle}>
              Краснознаменский завод
              <span className={styles.highlight}> полупроводниковых приборов</span>
              <span className={styles.brandName}>"Арсенал"</span>
            </h1>
            <p className={styles.mainSubtitle}>
              Более 20 лет опыта в разработке и производстве электронной компонентной базы. 
              Ведущий производитель транзисторов, диодов, ВЧ кабельных сборок и соединителей.
            </p>
            <div className={styles.mainContact}>
              <div className={styles.phoneContainer}>
                <div className={styles.phoneIcon}>📞</div>
                <div className={styles.phoneInfo}>
                  <div className={styles.phoneLabel}>Отдел продаж</div>
                  <a href="tel:+74955899266" className={styles.phoneNumber}>+7 495 589-92-66</a>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.mainImage}>
            <PhotoSlideshow className={styles.mainSlideshow} />
          </div>
        </div>
      </section>

      {/* Products Section - Main Arsenal Products */}
      <section className={styles.infoSection}>
        <div className={styles.infoContainer}>
          <h2 className={styles.sectionTitle}>Основные направления производства</h2>
          <div className={styles.infoGrid}>
            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>⚡</div>
              <h3>Транзисторы</h3>
              <div className={styles.infoSubcategories}>
                <span>Навесной монтаж</span>
                <span>Гибридный монтаж</span>
                <span>Поверхностный монтаж</span>
              </div>
              <p>Высококачественные полупроводниковые транзисторы для различных применений</p>
            </div>
            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>💎</div>
              <h3>Диоды</h3>
              <p>Надежные полупроводниковые диоды с превосходными характеристиками</p>
            </div>
            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>🔌</div>
              <h3>НЧ соединители</h3>
              <p>Качественные низкочастотные соединители для электронных систем</p>
            </div>
            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>📡</div>
              <h3>ВЧ кабельные сборки</h3>
              <p>Высокочастотные кабельные решения для телекоммуникационного оборудования</p>
            </div>
            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>🔗</div>
              <h3>Жгутовое производство</h3>
              <p>Профессиональное изготовление кабельных жгутов и сборок</p>
            </div>
            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>🎛️</div>
              <h3>МКИО</h3>
              <p>Многоканальные коммутаторы и интерфейсные устройства</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className={styles.infoSection}>
        <div className={styles.infoContainer}>
          <h2 className={styles.sectionTitle}>Наши услуги</h2>
          <div className={styles.infoGrid}>
            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>🔬</div>
              <h3>Разработка</h3>
              <p>Полный цикл разработки электронной компонентной базы от концепции до серийного производства</p>
            </div>
            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>📦</div>
              <h3>Корпусирование</h3>
              <p>Профессиональное корпусирование полупроводниковых приборов с гарантией качества</p>
            </div>
            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>🧪</div>
              <h3>Испытания</h3>
              <p>Комплексные испытания продукции в соответствии с международными стандартами</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={styles.infoSection}>
        <div className={styles.liquidGlassStats}>
          <div className={styles.infoContainer}>
            <div className={styles.infoGrid}>
              <div className={styles.infoCard}>
                <div className={styles.statNumber}>20+</div>
                <div className={styles.statLabel}>лет опыта</div>
              </div>
              <div className={styles.infoCard}>
                <div className={styles.statNumber}>1000+</div>
                <div className={styles.statLabel}>типов изделий</div>
              </div>
              <div className={styles.infoCard}>
                <div className={styles.statNumber}>500+</div>
                <div className={styles.statLabel}>партнеров</div>
              </div>
              <div className={styles.infoCard}>
                <div className={styles.statNumber}>99.9%</div>
                <div className={styles.statLabel}>качество</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Expertise Section */}
      <section className={styles.infoSection}>
        <div className={styles.infoContainer}>
          <h2 className={styles.sectionTitle}>Наша экспертиза</h2>
          <div className={styles.infoGrid}>
            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>🏭</div>
              <h3>Комплексные проекты</h3>
              <p>Реализация сложных проектов от идеи до массового производства</p>
            </div>
            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>⚙️</div>
              <h3>Собственное производство</h3>
              <p>Полный технологический цикл на современном оборудовании</p>
            </div>
            <div className={styles.infoCard}>
              <div className={styles.expertiseIcon}>🔍</div>
              <h3>Контроль качества</h3>
              <p>Многоуровневая система контроля на всех этапах производства</p>
            </div>
            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>🤝</div>
              <h3>Партнерство</h3>
              <p>Долгосрочные отношения с ведущими компаниями отрасли</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className={styles.infoSection}>
        <div className={styles.liquidGlassContact}>
          <div className={styles.infoContainer}>
            <h2>Свяжитесь с нами</h2>
            <p>Мы готовы обсудить ваши потребности и предложить оптимальные решения</p>
            <div className={styles.contactMethods}>
              <div className={styles.contactCard}>
                <div className={styles.infoIcon}>📞</div>
                <div className={styles.contactInfo}>
                  <h3>Телефон</h3>
                  <a href="tel:+74955899266" className={styles.contactLink}>+7 495 589-92-66</a>
                </div>
              </div>
              <div className={styles.contactCard}>
                <div className={styles.infoIcon}>✉️</div>
                <div className={styles.contactInfo}>
                  <h3>Email</h3>
                  <a href="mailto:info@krzpp.ru" className={styles.contactLink}>info@krzpp.ru</a>
                </div>
              </div>
              <div className={styles.contactCard}>
                <div className={styles.infoIcon}>📍</div>
                <div className={styles.contactInfo}>
                  <h3>Адрес</h3>
                  <span className={styles.contactText}>г. Краснознаменск</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerContent}>
            <div className={styles.footerSection}>
              <h4>АО "Арсенал" КрЗПП</h4>
              <p>Краснознаменский завод полупроводниковых приборов</p>
              <div className={styles.contactInfo}>
                <p>📞 +7 495 589-92-66</p>
              </div>
            </div>
            <div className={styles.footerSection}>
              <h4>Продукция</h4>
              <ul>
                <li>Транзисторы</li>
                <li>Диоды</li>
                <li>НЧ соединители</li>
                <li>ВЧ кабельные сборки</li>
                <li>Жгутовое производство</li>
                <li>МКИО</li>
              </ul>
            </div>
            <div className={styles.footerSection}>
              <h4>Услуги</h4>
              <ul>
                <li>Разработка</li>
                <li>Корпусирование</li>
                <li>Испытания</li>
                <li>Комплексные проекты</li>
              </ul>
            </div>
            <div className={styles.footerSection}>
              <h4>Компания</h4>
              <ul>
                <li>О предприятии</li>
                <li>Вакансии</li>
                <li>Контакты</li>
                <li>Партнерам</li>
              </ul>
            </div>
            <div className={styles.footerSection}>
              <h4>Для сотрудников</h4>
              <div className={styles.employeeLogin}>
                <p>Доступ к внутренней системе предприятия</p>
                <Link to="/login" className={styles.employeeLoginBtn}>
                  👤 Войти в систему
                </Link>
              </div>
            </div>
          </div>
          <div className={styles.footerBottom}>
            <p>&copy; 2025 АО "Арсенал" КрЗПП. Все права защищены.</p>
          </div>
        </div>
      </footer>

    </div>
  );
}; 