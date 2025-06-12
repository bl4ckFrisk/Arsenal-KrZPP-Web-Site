import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from '../../styles/AuthPages.module.css';

interface UserData {
  email: string;
  password: string;
  username: string;
  firstName: string;
  lastName: string;
  middleName: string;
  position: string;
  department: string;
  employeeId: string;
}

export const DevRegisterPage = () => {
  const [formData, setFormData] = useState<UserData>({
    email: '',
    password: '',
    username: '',
    firstName: '',
    lastName: '',
    middleName: '',
    position: '',
    department: '',
    employeeId: ''
  });
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generateEmployeeId = () => {
    const timestamp = Date.now().toString().slice(-6);
    const randomNum = Math.floor(Math.random() * 100).toString().padStart(2, '0');
    return `КрЗПП${timestamp}${randomNum}`;
  };

  const fillTestData = () => {
    const testUsers = [
      {
        email: 'ivanov.test@krzpp.ru',
        username: 'ivanov_ii',
        firstName: 'Иван',
        lastName: 'Иванов',
        middleName: 'Иванович',
        position: 'Инженер-технолог',
        department: 'Производственный участок №1'
      },
      {
        email: 'petrov.test@krzpp.ru',
        username: 'petrov_ap',
        firstName: 'Андрей',
        lastName: 'Петров',
        middleName: 'Петрович',
        position: 'Мастер участка',
        department: 'Производственный участок №2'
      },
      {
        email: 'sidorova.test@krzpp.ru',
        username: 'sidorova_ek',
        firstName: 'Екатерина',
        lastName: 'Сидорова',
        middleName: 'Константиновна',
        position: 'Контролер качества',
        department: 'Отдел технического контроля'
      }
    ];
    
    const randomUser = testUsers[Math.floor(Math.random() * testUsers.length)];
    setFormData({
      ...randomUser,
      password: 'test123456',
      employeeId: generateEmployeeId()
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    
    try {
      const response = await fetch('/api/auth/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMessage(`Пользователь ${data.user.username} успешно создан!`);
        setIsSuccess(true);
        setFormData({
          email: '',
          password: '',
          username: '',
          firstName: '',
          lastName: '',
          middleName: '',
          position: '',
          department: '',
          employeeId: ''
        });
      } else {
        setMessage(data.message || 'Ошибка при создании пользователя');
        setIsSuccess(false);
      }
    } catch (err) {
      setMessage('Не удалось создать пользователя');
      setIsSuccess(false);
    }
  };

  const createTestUsers = async () => {
    const testUsers = [
      {
        email: 'ivanov.test@krzpp.ru',
        password: 'test123456',
        username: 'ivanov_ii',
        firstName: 'Иван',
        lastName: 'Иванов',
        middleName: 'Иванович',
        position: 'Инженер-технолог',
        department: 'Производственный участок №1',
        employeeId: 'КрЗПП001001'
      },
      {
        email: 'petrov.test@krzpp.ru',
        password: 'test123456',
        username: 'petrov_ap',
        firstName: 'Андрей',
        lastName: 'Петров',
        middleName: 'Петрович',
        position: 'Мастер участка',
        department: 'Производственный участок №2',
        employeeId: 'КрЗПП002001'
      },
      {
        email: 'sidorova.test@krzpp.ru',
        password: 'test123456',
        username: 'sidorova_ek',
        firstName: 'Екатерина',
        lastName: 'Сидорова',
        middleName: 'Константиновна',
        position: 'Контролер качества',
        department: 'Отдел технического контроля',
        employeeId: 'КрЗПП003001'
      },
      {
        email: 'kozlov.test@krzpp.ru',
        password: 'test123456',
        username: 'kozlov_dm',
        firstName: 'Дмитрий',
        lastName: 'Козлов',
        middleName: 'Михайлович',
        position: 'Старший инженер',
        department: 'Отдел разработки',
        employeeId: 'КрЗПП004001'
      },
      {
        email: 'popova.test@krzpp.ru',
        password: 'test123456',
        username: 'popova_nv',
        firstName: 'Наталья',
        lastName: 'Попова',
        middleName: 'Владимировна',
        position: 'Экономист',
        department: 'Планово-экономический отдел',
        employeeId: 'КрЗПП005001'
      },
      {
        email: 'volkov.test@krzpp.ru',
        password: 'test123456',
        username: 'volkov_sv',
        firstName: 'Сергей',
        lastName: 'Волков',
        middleName: 'Викторович',
        position: 'Наладчик оборудования',
        department: 'Производственный участок №3',
        employeeId: 'КрЗПП006001'
      },
      {
        email: 'orlova.test@krzpp.ru',
        password: 'test123456',
        username: 'orlova_av',
        firstName: 'Анна',
        lastName: 'Орлова',
        middleName: 'Владимировна',
        position: 'Менеджер по продажам',
        department: 'Отдел продаж',
        employeeId: 'КрЗПП007001'
      }
    ];

    let successCount = 0;
    let errors: string[] = [];

    for (const user of testUsers) {
      try {
        const response = await fetch('/api/auth/create-user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(user),
        });
        
        if (response.ok) {
          successCount++;
        } else {
          const errorData = await response.json();
          errors.push(`${user.username}: ${errorData.message}`);
        }
      } catch (err) {
        errors.push(`${user.username}: Ошибка сети`);
      }
    }

    if (errors.length > 0) {
      setMessage(`Создано пользователей: ${successCount}. Ошибки: ${errors.join(', ')}`);
      setIsSuccess(successCount > 0);
    } else {
      setMessage(`Успешно создано ${successCount} тестовых пользователей`);
      setIsSuccess(true);
    }
  };

  return (
    <div className={styles.authPage}>
      <header className={styles.authHeader}>
        <div className={styles.headerContent}>
          <Link to="/" className={styles.headerLogo}>
            <div className={styles.logoContainer}>
              <div className={styles.logoText}>Arsenal</div>
              <div className={styles.logoSubtext}>КрЗПП</div>
            </div>
          </Link>
        </div>
      </header>

      <div className={styles.authContent}>
        <div className={`${styles.formContainer} ${styles.wide}`}>
          <div className={styles.formHeader}>
            <h2 className={styles.formTitle}>Создание сотрудника</h2>
            <p className={styles.formSubtitle}>Регистрация нового сотрудника в системе</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.authForm}>
            <div className={styles.inputGroup}>
              <label htmlFor="email">Email</label>
              <div className={styles.inputWrapper}>
                <span className={styles.inputIcon}>✉</span>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="ivan@krzpp.ru"
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="username">Логин</label>
              <div className={styles.inputWrapper}>
                <span className={styles.inputIcon}>👤</span>
                <input
                  type="text"
                  id="username"
                  name="username"
                  required
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="ivanov_ii"
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="password">Пароль</label>
              <div className={styles.inputWrapper}>
                <span className={styles.inputIcon}>🔒</span>
                <input
                  type="password"
                  id="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Минимум 6 символов"
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.inputGroup}>
                <label htmlFor="lastName">Фамилия</label>
                <div className={styles.inputWrapper}>
                  <span className={styles.inputIcon}>👨</span>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Иванов"
                  />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="firstName">Имя</label>
                <div className={styles.inputWrapper}>
                  <span className={styles.inputIcon}>👤</span>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="Иван"
                  />
                </div>
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="middleName">Отчество</label>
              <div className={styles.inputWrapper}>
                <span className={styles.inputIcon}>👨</span>
                <input
                  type="text"
                  id="middleName"
                  name="middleName"
                  value={formData.middleName}
                  onChange={handleInputChange}
                  placeholder="Иванович"
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.inputGroup}>
                <label htmlFor="position">Должность</label>
                <div className={styles.inputWrapper}>
                  <span className={styles.inputIcon}>💼</span>
                  <input
                    type="text"
                    id="position"
                    name="position"
                    required
                    value={formData.position}
                    onChange={handleInputChange}
                    placeholder="Инженер-технолог"
                  />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="department">Отдел</label>
                <div className={styles.inputWrapper}>
                  <span className={styles.inputIcon}>🏢</span>
                  <input
                    type="text"
                    id="department"
                    name="department"
                    required
                    value={formData.department}
                    onChange={handleInputChange}
                    placeholder="Производственный участок №1"
                  />
                </div>
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="employeeId">Табельный номер</label>
              <div className={styles.inputWrapper}>
                <span className={styles.inputIcon}>🏷</span>
                <input
                  type="text"
                  id="employeeId"
                  name="employeeId"
                  required
                  value={formData.employeeId}
                  onChange={handleInputChange}
                  placeholder="КрЗПП001001"
                />
              </div>
            </div>

            <div className={styles.formActions}>
              <button 
                type="button" 
                onClick={fillTestData} 
                className={`${styles.authButton} ${styles.secondary}`}
              >
                Заполнить тестовыми данными
              </button>
              
              <button 
                type="submit" 
                className={styles.authButton}
              >
                Создать сотрудника
              </button>
            </div>
          </form>

          <div className={styles.formActions}>
            <button 
              type="button" 
              onClick={createTestUsers} 
              className={`${styles.authButton} ${styles.secondary} ${styles.wide}`}
            >
              Создать 7 тестовых сотрудников
            </button>
          </div>

          {message && (
            <div className={`${styles.message} ${isSuccess ? styles.success : styles.error}`}>
              {message}
            </div>
          )}

          <div className={styles.formFooter}>
            <p>
              <Link to="/login" className={styles.authLink}>
                ← Вернуться к входу
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}; 