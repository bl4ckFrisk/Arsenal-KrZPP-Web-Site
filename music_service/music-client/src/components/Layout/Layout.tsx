import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from './Layout.module.css';
import { FaHome, FaCog, FaSearch, FaMusic, FaHeadphones, FaUser } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';
import { Icon } from '../Icon/Icon';

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuth();

    const isActive = (path: string) => {
        return location.pathname === path;
    };

    const handleProfileClick = () => {
        navigate('/profile');
    };

    return (
        <div className={styles.layout}>
            <aside className={styles.sidebar}>
                <Link to="/" className={styles.logo}>
                    <Icon icon={FaHeadphones} size={28} />
                    <span>October</span>
                </Link>

                <nav className={styles.nav}>
                    <Link
                        to="/"
                        className={`${styles.navItem} ${isActive('/') ? styles.active : ''}`}
                    >
                        <Icon icon={FaHome} size={20} />
                        <span>Главная</span>
                    </Link>

                    <Link
                        to="/search"
                        className={`${styles.navItem} ${isActive('/search') ? styles.active : ''}`}
                    >
                        <Icon icon={FaSearch} size={20} />
                        <span>Поиск</span>
                    </Link>

                    {isAuthenticated && (
                        <>
                            <Link
                                to="/my-tracks"
                                className={`${styles.navItem} ${isActive('/my-tracks') ? styles.active : ''}`}
                            >
                                <Icon icon={FaMusic} size={20} />
                                <span>Мои треки</span>
                            </Link>
                        </>
                    )}

                    <Link
                        to="/settings"
                        className={`${styles.navItem} ${isActive('/settings') ? styles.active : ''}`}
                    >
                        <Icon icon={FaCog} size={20} />
                        <span>Настройки</span>
                    </Link>
                </nav>

                {isAuthenticated && user && (
                    <button 
                        className={`${styles.profile} ${isActive('/profile') ? styles.active : ''}`}
                        onClick={handleProfileClick}
                    >
                        <div className={styles.profileAvatar}>
                            <Icon icon={FaUser} size={20} />
                        </div>
                        <div className={styles.profileInfo}>
                            <p className={styles.profileName}>{user.nickname || user.username || 'Пользователь'}</p>
                            <p className={styles.profileEmail}>{user.email}</p>
                        </div>
                    </button>
                )}
            </aside>

            <main className={styles.content}>
                {children}
            </main>
        </div>
    );
}; 