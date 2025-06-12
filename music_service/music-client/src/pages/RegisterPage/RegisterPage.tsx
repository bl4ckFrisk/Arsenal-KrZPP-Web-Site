import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './RegisterPage.module.css';
import { useAuthStore } from '../../store/useAuthStore';

export const RegisterPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [nickname, setNickname] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { register } = useAuthStore();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        try {
            await register(email, password, username, nickname);
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Не удалось зарегистрироваться');
        }
    };

    return (
        <div className={styles.registerPage}>
            <div className={styles.formContainer}>
                <h1>Создать аккаунт</h1>
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
                            placeholder="example@email.com"
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="username">Имя пользователя</label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            placeholder="Используется для входа в систему"
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="nickname">Псевдоним</label>
                        <input
                            id="nickname"
                            type="text"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            required
                            placeholder="Как вас будут видеть другие пользователи"
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
                            placeholder="Минимум 6 символов"
                        />
                    </div>

                    <button type="submit" className={styles.submitButton}>
                        Зарегистрироваться
                    </button>
                </form>
            </div>
        </div>
    );
}; 