import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ProfilePage.module.css';
import { useAuth } from '../../hooks/useAuth';
import { useAuthStore } from '../../store/useAuthStore';

export const ProfilePage = () => {
    const { user } = useAuth();
    const { logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (!user) {
        return <div>Загрузка...</div>;
    }

    return (
        <div className={styles.profilePage}>
            <div className={styles.profileHeader}>
                <div className={styles.avatar}>
                    {user.nickname?.[0] || user.username?.[0] || user.email[0]}
                </div>
                <div className={styles.userInfo}>
                    <h1>{user.nickname || user.username || 'Пользователь'}</h1>
                    <p className={styles.email}>{user.email}</p>
                </div>
            </div>
            
            <div className={styles.stats}>
                <div className={styles.statItem}>
                    <h3>Почта</h3>
                    <p>{user.email}</p>
                </div>
                <div className={styles.statItem}>
                    <h3>Имя пользователя</h3>
                    <p>{user.username || 'Не указано'}</p>
                </div>
                <div className={styles.statItem}>
                    <h3>Никнейм</h3>
                    <p>{user.nickname || 'Не указано'}</p>
                </div>
            </div>

            <button className={styles.logoutButton} onClick={handleLogout}>
                Выйти из аккаунта
            </button>
        </div>
    );
}; 