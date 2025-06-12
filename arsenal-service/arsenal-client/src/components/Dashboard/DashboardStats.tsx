import React, { useState, useEffect } from 'react';
import styles from './DashboardStats.module.css';

interface Stats {
  documentsCount: number;
  productsCount: number;
  unreadMessages: number;
  lowStockProducts: number;
}

export const DashboardStats = () => {
  const [stats, setStats] = useState<Stats>({
    documentsCount: 0,
    productsCount: 0,
    unreadMessages: 0,
    lowStockProducts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('jwt_token') || sessionStorage.getItem('jwt_token');
        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        };

        // Fetch parallel requests
        const [documentsRes, productsRes, messagesRes, lowStockRes] = await Promise.all([
          fetch('/api/documents', { headers }),
          fetch('/api/products', { headers }),
          fetch('/api/messages/unread-count', { headers }),
          fetch('/api/products/low-stock?threshold=10', { headers }),
        ]);

        const [documents, products, messages, lowStock] = await Promise.all([
          documentsRes.ok ? documentsRes.json() : [],
          productsRes.ok ? productsRes.json() : [],
          messagesRes.ok ? messagesRes.json() : { count: 0 },
          lowStockRes.ok ? lowStockRes.json() : [],
        ]);

        setStats({
          documentsCount: documents.length || 0,
          productsCount: products.length || 0,
          unreadMessages: messages.count || 0,
          lowStockProducts: lowStock.length || 0,
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statItems = [
    {
      title: 'Документы',
      value: stats.documentsCount,
      icon: '📁',
      color: 'blue',
      description: 'Всего документов в системе'
    },
    {
      title: 'Продукция',
      value: stats.productsCount,
      icon: '🔧',
      color: 'green',
      description: 'Позиций в каталоге'
    },
    {
      title: 'Непрочитанные',
      value: stats.unreadMessages,
      icon: '💬',
      color: 'yellow',
      description: 'Новых сообщений'
    },
    {
      title: 'Мало на складе',
      value: stats.lowStockProducts,
      icon: '⚠️',
      color: 'red',
      description: 'Товаров с низким остатком'
    },
  ];

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Загрузка статистики...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Обзор системы</h2>
        <p className={styles.subtitle}>Основные показатели работы</p>
      </div>

      <div className={styles.statsGrid}>
        {statItems.map((item, index) => (
          <div key={index} className={`${styles.statCard} ${styles[item.color]}`}>
            <div className={styles.statIcon}>{item.icon}</div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>{item.value}</div>
              <div className={styles.statTitle}>{item.title}</div>
              <div className={styles.statDescription}>{item.description}</div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.quickActions}>
        <h3 className={styles.sectionTitle}>Быстрые действия</h3>
        <div className={styles.actionsGrid}>
          <button className={styles.actionButton}>
            <span className={styles.actionIcon}>📄</span>
            <span>Загрузить документ</span>
          </button>
          <button className={styles.actionButton}>
            <span className={styles.actionIcon}>➕</span>
            <span>Добавить продукт</span>
          </button>
          <button className={styles.actionButton}>
            <span className={styles.actionIcon}>✉️</span>
            <span>Написать сообщение</span>
          </button>
          <button className={styles.actionButton}>
            <span className={styles.actionIcon}>🔍</span>
            <span>Поиск по партии</span>
          </button>
        </div>
      </div>
    </div>
  );
}; 