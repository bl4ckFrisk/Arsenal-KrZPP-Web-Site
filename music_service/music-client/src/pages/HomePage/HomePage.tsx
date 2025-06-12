import React, { useState, useEffect } from 'react';
import styles from './HomePage.module.css';
import { TrackList } from '../../components/TrackList/TrackList';
import { Track } from '../../types/Track';
import apiClient from '../../api/client';

export const HomePage = () => {
    const [tracks, setTracks] = useState<Track[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadTracks();
    }, []);

    const loadTracks = async () => {
        try {
            setIsLoading(true);
            console.log('Загрузка треков...');
            const response = await apiClient.get('/tracks');
            console.log('Треки загружены:', response.data);
            setTracks(response.data);
        } catch (error) {
            console.error('Не удалось загрузить треки:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <div className={styles.loading}>Загрузка треков...</div>;
    }

    return (
        <div className={styles.homePage}>
            <div className={styles.header}>
                <h1>Откройте для себя музыку</h1>
                <p className={styles.subtitle}>Слушайте последние треки от всех исполнителей</p>
            </div>

            {tracks.length === 0 ? (
                <div className={styles.emptyState}>
                    <h2>Треки отсутствуют</h2>
                    <p>Станьте первым, кто загрузит трек!</p>
                </div>
            ) : (
                <TrackList tracks={tracks} />
            )}
        </div>
    );
}; 