import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

import { DashboardStats } from '../../components/Dashboard/DashboardStats';
import { RegisterSection } from '../../components/Dashboard/RegisterSection';
import styles from './DashboardPage.module.css';

type ActiveSection = 'overview' | 'documents' | 'products' | 'messages' | 'register';

export const DashboardPage = () => {
  const [activeSection, setActiveSection] = useState<ActiveSection>('overview');
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('jwt_token');
    sessionStorage.removeItem('jwt_token');
    navigate('/welcome');
    window.location.reload();
  };

  useEffect(() => {
    // Fetch unread messages count
    const fetchUnreadCount = async () => {
      try {
        const response = await fetch('/api/messages/unread-count', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('jwt_token') || sessionStorage.getItem('jwt_token')}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setUnreadCount(data.count);
        }
      } catch (error) {
        console.error('Failed to fetch unread count:', error);
      }
    };

    fetchUnreadCount();
    // Poll every 30 seconds for new messages
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  // Check if user has management role
  const isManager = user?.position && [
    'Директор',
    'Заместитель директора',
    'Главный инженер',
    'Начальник отдела',
    'Заместитель начальника отдела',
    'Главный конструктор',
    'Ведущий инженер',
    'Руководитель группы',
    'Мастер участка'
  ].some(role => user.position?.toLowerCase().includes(role.toLowerCase()));

  const menuItems = [
    { id: 'overview' as ActiveSection, label: 'Обзор', icon: '📊' },
    { id: 'documents' as ActiveSection, label: 'Документы', icon: '📁' },
    { id: 'products' as ActiveSection, label: 'Продукция', icon: '🔧' },
    { 
      id: 'messages' as ActiveSection, 
      label: 'Сообщения', 
      icon: '💬',
      badge: unreadCount > 0 ? unreadCount : undefined
    },
    ...(isManager ? [{ id: 'register' as ActiveSection, label: 'Регистрация', icon: '👤' }] : []),
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return <DashboardStats />;
      case 'documents':
        return <div>Документы - раздел в разработке</div>;
      case 'products':
        return <div>Продукция - раздел в разработке</div>;
      case 'messages':
        return <div>Сообщения - раздел в разработке</div>;
      case 'register':
        return isManager ? <RegisterSection /> : <div>Доступ запрещен</div>;
      default:
        return <DashboardStats />;
    }
  };

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Панель управления</h1>
          <div className={styles.headerRight}>
            <div className={styles.userInfo}>
              <span className={styles.userName}>
                {user?.firstName && user?.lastName 
                  ? `${user.firstName} ${user.lastName}`
                  : user?.username || 'Сотрудник'
                }
              </span>
              <span className={styles.userRole}>{user?.position || 'Сотрудник'}</span>
              <span className={styles.userDepartment}>{user?.department}</span>
            </div>
            <button className={styles.logoutBtn} onClick={handleLogout}>
              Выйти
            </button>
          </div>
        </div>
      </header>

      <div className={styles.container}>
        <aside className={styles.sidebar}>
          <nav className={styles.nav}>
            {menuItems.map((item) => (
              <button
                key={item.id}
                className={`${styles.navItem} ${activeSection === item.id ? styles.active : ''}`}
                onClick={() => setActiveSection(item.id)}
              >
                <span className={styles.navIcon}>{item.icon}</span>
                <span className={styles.navLabel}>{item.label}</span>
                {item.badge && (
                  <span className={styles.badge}>{item.badge}</span>
                )}
              </button>
            ))}
          </nav>
        </aside>

        <main className={styles.main}>
          <div className={styles.content}>
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}; 