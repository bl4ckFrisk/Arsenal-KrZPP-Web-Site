import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from '../../styles/AuthPages.module.css';
import { useAuthStore } from '../../store/useAuthStore';

export const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuthStore();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        try {
            await login(username, password, remember);
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Не удалось войти');
        }
    };

    return (
        <div className={styles.authPage}>
            {/* Header Navigation */}
            <header className={styles.header}>
                <div className={styles.container}>
                    <Link to="/" className={styles.logo}>
                        <h2>АО "Арсенал" КрЗПП</h2>
                        <span>Краснознаменский завод полупроводниковых приборов</span>
                    </Link>
                    <nav className={styles.nav}>
                        <Link to="/" className={styles.backLink}>← Вернуться на главную</Link>
                    </nav>
                </div>
            </header>

            <div className={styles.authContent}>
                <div className={styles.formContainer}>
                    <div className={styles.formHeader}>
                        <div className={styles.authIcon}>🔐</div>
                        <h1>Вход в систему</h1>
                        <p>Авторизация для сотрудников предприятия</p>
                    </div>

                    <form onSubmit={handleSubmit} className={styles.authForm}>
                        {error && <div className={styles.error}>{error}</div>}
                        
                        <div className={styles.inputGroup}>
                            <label htmlFor="username">
                                <span className={styles.inputIcon}>👤</span>
                                Логин
                            </label>
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="ivanov_ii"
                                required
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="password">
                                <span className={styles.inputIcon}>🔑</span>
                                Пароль
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Введите ваш пароль"
                                required
                            />
                        </div>

                        <div className={styles.checkboxGroup}>
                            <label className={styles.rememberMe}>
                                <input
                                    type="checkbox"
                                    checked={remember}
                                    onChange={(e) => setRemember(e.target.checked)}
                                />
                                <span className={styles.checkmark}></span>
                                Запомнить меня
                            </label>
                        </div>

                        <button type="submit" className={styles.submitButton}>
                            <span>Войти в систему</span>
                            <span className={styles.buttonIcon}>→</span>
                        </button>
                    </form>

                    <div className={styles.formFooter}>
                        <p>Нет доступа к системе?</p>
                        <p>Обратитесь к ответственному лицу для получения учетной записи</p>
                    </div>
                </div>
            </div>
        </div>
    );
}; 