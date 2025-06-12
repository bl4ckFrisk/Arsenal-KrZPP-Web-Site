import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from '../../styles/AuthPages.module.css';
import { useAuthStore } from '../../store/useAuthStore';

export const RegisterPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { register } = useAuthStore();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        try {
            await register(email, password, username);
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Не удалось зарегистрироваться');
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
                <div className={`${styles.formContainer} ${styles.wide}`}>
                    <div className={styles.formHeader}>
                        <div className={styles.authIcon}>👥</div>
                        <h1>Регистрация сотрудника</h1>
                        <p>Создание учетной записи для доступа к системе предприятия</p>
                    </div>

                    <form onSubmit={handleSubmit} className={styles.authForm}>
                        {error && <div className={styles.error}>{error}</div>}
                        
                        <div className={styles.inputGroup}>
                            <label htmlFor="email">
                                <span className={styles.inputIcon}>📧</span>
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="example@krzpp.ru"
                                required
                            />
                        </div>

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
                                placeholder="Минимум 6 символов"
                                required
                            />
                        </div>

                        <button type="submit" className={styles.submitButton}>
                            <span>Создать аккаунт</span>
                            <span className={styles.buttonIcon}>→</span>
                        </button>
                    </form>

                    <div className={styles.formFooter}>
                        <p className={styles.large}>Уже есть учетная запись?</p>
                        <Link to="/login" className={styles.authLink}>Войти в систему</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}; 