import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './LoginPage.module.css';
import { useAuthStore } from '../../store/useAuthStore';

export const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuthStore();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        try {
            await login(email, password, remember);
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Не удалось войти');
        }
    };

    return (
        <div className={styles.loginPage}>
            <div className={styles.formContainer}>
                <h1>С возвращением</h1>
                <form onSubmit={handleSubmit}>
                    {error && <div className={styles.error}>{error}</div>}
                    
                    <div className={styles.inputGroup}>
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="password">Пароль</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className={styles.rememberMe}>
                        <label>
                            <input
                                type="checkbox"
                                checked={remember}
                                onChange={(e) => setRemember(e.target.checked)}
                            />
                            Запомнить меня
                        </label>
                    </div>

                    <button type="submit" className={styles.submitButton}>
                        Войти
                    </button>
                </form>
            </div>
        </div>
    );
}; 