import React, { useState } from 'react';
import styles from './RegisterSection.module.css';

interface RegisterData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  middleName: string;
  position: string;
  department: string;
  employeeId: string;
}

export const RegisterSection = () => {
  const [formData, setFormData] = useState<RegisterData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    middleName: '',
    position: '',
    department: '',
    employeeId: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setMessage({ text: 'Пароли не совпадают', type: 'error' });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch('http://localhost:3000/auth/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('jwt_token') || sessionStorage.getItem('jwt_token')}`
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          middleName: formData.middleName,
          position: formData.position,
          department: formData.department,
          employeeId: formData.employeeId
        })
      });

      if (response.ok) {
        setMessage({ text: 'Пользователь успешно зарегистрирован', type: 'success' });
        setFormData({
          username: '',
          email: '',
          password: '',
          confirmPassword: '',
          firstName: '',
          lastName: '',
          middleName: '',
          position: '',
          department: '',
          employeeId: ''
        });
      } else {
        const errorData = await response.json();
        setMessage({ text: errorData.message || 'Ошибка регистрации', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Ошибка подключения к серверу', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.registerSection}>
      <div className={styles.header}>
        <h2 className={styles.title}>Регистрация нового сотрудника</h2>
        <p className={styles.subtitle}>Создание учетной записи для нового сотрудника</p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Имя пользователя</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className={styles.input}
              placeholder="Введите имя пользователя"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className={styles.input}
              placeholder="email@example.com"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Пароль</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className={styles.input}
              placeholder="Введите пароль"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Подтверждение пароля</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className={styles.input}
              placeholder="Повторите пароль"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Имя</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              className={styles.input}
              placeholder="Введите имя"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Фамилия</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              className={styles.input}
              placeholder="Введите фамилию"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Отчество</label>
            <input
              type="text"
              name="middleName"
              value={formData.middleName}
              onChange={handleChange}
              className={styles.input}
              placeholder="Введите отчество"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Должность</label>
            <select
              name="position"
              value={formData.position}
              onChange={handleChange}
              required
              className={styles.input}
            >
              <option value="">Выберите должность</option>
              <option value="Инженер">Инженер</option>
              <option value="Старший инженер">Старший инженер</option>
              <option value="Ведущий инженер">Ведущий инженер</option>
              <option value="Главный инженер">Главный инженер</option>
              <option value="Конструктор">Конструктор</option>
              <option value="Ведущий конструктор">Ведущий конструктор</option>
              <option value="Главный конструктор">Главный конструктор</option>
              <option value="Технолог">Технолог</option>
              <option value="Ведущий технолог">Ведущий технолог</option>
              <option value="Специалист">Специалист</option>
              <option value="Ведущий специалист">Ведущий специалист</option>
              <option value="Начальник отдела">Начальник отдела</option>
              <option value="Заместитель начальника отдела">Заместитель начальника отдела</option>
              <option value="Руководитель группы">Руководитель группы</option>
              <option value="Мастер участка">Мастер участка</option>
              <option value="Директор">Директор</option>
              <option value="Заместитель директора">Заместитель директора</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Отдел</label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
              className={styles.input}
            >
              <option value="">Выберите отдел</option>
              <option value="Конструкторский отдел">Конструкторский отдел</option>
              <option value="Технологический отдел">Технологический отдел</option>
              <option value="Отдел качества">Отдел качества</option>
              <option value="Производственный отдел">Производственный отдел</option>
              <option value="Отдел снабжения">Отдел снабжения</option>
              <option value="Экономический отдел">Экономический отдел</option>
              <option value="Юридический отдел">Юридический отдел</option>
              <option value="Отдел кадров">Отдел кадров</option>
              <option value="IT отдел">IT отдел</option>
              <option value="Служба безопасности">Служба безопасности</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Табельный номер</label>
            <input
              type="text"
              name="employeeId"
              value={formData.employeeId}
              onChange={handleChange}
              required
              className={styles.input}
              placeholder="Введите табельный номер"
            />
          </div>
        </div>

        {message && (
          <div className={`${styles.message} ${styles[message.type]}`}>
            {message.text}
          </div>
        )}

        <button 
          type="submit" 
          disabled={isLoading}
          className={styles.submitBtn}
        >
          {isLoading ? 'Регистрация...' : 'Зарегистрировать сотрудника'}
        </button>
      </form>
    </div>
  );
}; 