import React, { useState } from 'react';
import styles from './AuthModal.module.css';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'register';
  onSwitchMode: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, mode, onSwitchMode }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: ''
  });

  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    setIsLoading(true);

    // Простая валидация
    const newErrors: string[] = [];
    
    if (!formData.email) newErrors.push('Введите email');
    if (!formData.password) newErrors.push('Введите пароль');
    
    if (mode === 'register') {
      if (!formData.fullName) newErrors.push('Введите полное имя');
      if (formData.password !== formData.confirmPassword) {
        newErrors.push('Пароли не совпадают');
      }
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    // Имитация API запроса
    setTimeout(() => {
      setIsLoading(false);
      onClose();
      // Здесь будет реальная авторизация
    }, 1500);
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.liquidGlassModal}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            {mode === 'login' ? 'Вход в систему' : 'Регистрация'}
            <span className={styles.companyName}>АО "Арсенал" КрЗПП</span>
          </h2>
          <button className={styles.closeButton} onClick={onClose}>
            ✕
          </button>
        </div>

        <form className={styles.authForm} onSubmit={handleSubmit}>
          {errors.length > 0 && (
            <div className={styles.errorContainer}>
              {errors.map((error, index) => (
                <div key={index} className={styles.errorMessage}>
                  {error}
                </div>
              ))}
            </div>
          )}

          {mode === 'register' && (
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Полное имя</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className={styles.liquidGlassInput}
                placeholder="Введите ваше полное имя"
              />
            </div>
          )}

          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={styles.liquidGlassInput}
              placeholder="Введите ваш email"
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>Пароль</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={styles.liquidGlassInput}
              placeholder="Введите пароль"
            />
          </div>

          {mode === 'register' && (
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Подтвердите пароль</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={styles.liquidGlassInput}
                placeholder="Подтвердите пароль"
              />
            </div>
          )}

          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className={styles.loadingSpinner}></div>
            ) : (
              mode === 'login' ? 'Войти' : 'Зарегистрироваться'
            )}
          </button>

          <div className={styles.switchMode}>
            {mode === 'login' ? (
              <>
                Нет аккаунта?{' '}
                <button type="button" onClick={onSwitchMode} className={styles.switchButton}>
                  Зарегистрироваться
                </button>
              </>
            ) : (
              <>
                Уже есть аккаунт?{' '}
                <button type="button" onClick={onSwitchMode} className={styles.switchButton}>
                  Войти
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}; 