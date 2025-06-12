import React, { useState, useEffect, useCallback } from 'react';
import styles from './MyTracksPage.module.css';
import { TrackList } from '../../components/TrackList/TrackList';
import { Track } from '../../types/Track';
import apiClient from '../../api/client';
import { useAuth } from '../../hooks/useAuth';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { Icon } from '../../components/Icon/Icon';
import { UploadModal } from '../../components/Modals/UploadModal';

export const MyTracksPage = () => {
    const [tracks, setTracks] = useState<Track[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const { user } = useAuth();

    const loadTracks = useCallback(async () => {
        if (!user?.id) {
            setTracks([]);
            setIsLoading(false);
            return;
        }

        try {
            const response = await apiClient.get('/tracks');
            // Фильтруем треки, оставляя только те, которые принадлежат текущему пользователю
            const userTracks = response.data.filter((track: Track) => track.artist.id === user.id);
            setTracks(userTracks);
            setError(null);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Не удалось загрузить треки');
        } finally {
            setIsLoading(false);
        }
    }, [user?.id]);

    useEffect(() => {
        loadTracks();
    }, [loadTracks]);

    const handleTrackDelete = async (trackId: number) => {
        // Проверяем, существует ли трек в текущем списке
        const trackToDelete = tracks.find(track => track.id === trackId);
        if (!trackToDelete) {
            setError('Трек не найден');
            return;
        }

        try {
            // Сначала делаем запрос на удаление
            const response = await apiClient.delete(`/tracks/${trackId}`);
            
            if (response.status === 200) {
                // Если удаление прошло успешно, обновляем локальный список
                setTracks(currentTracks => currentTracks.filter(track => track.id !== trackId));
                setError(null);
            }
        } catch (err: any) {
            if (err.response?.status === 404) {
                // Если трек не найден на сервере, все равно удаляем его из локального списка
                setTracks(currentTracks => currentTracks.filter(track => track.id !== trackId));
            } else {
                setError(err.response?.data?.message || 'Не удалось удалить трек');
            }
        }
    };

    const handleUploadSuccess = async () => {
        setIsUploadModalOpen(false);
        await loadTracks();
    };

    if (isLoading) {
        return <div className={styles.loading}>Загрузка...</div>;
    }

    if (error) {
        return <div className={styles.error}>{error}</div>;
    }

    return (
        <div className={styles.myTracksPage}>
            <div className={styles.header}>
                <h1>Мои треки</h1>
                <button className={styles.uploadButton} onClick={() => setIsUploadModalOpen(true)}>
                    <Icon icon={FaCloudUploadAlt} size={20} />
                    Загрузить трек
                </button>
            </div>

            {tracks.length === 0 ? (
                <div className={styles.emptyState}>
                    <Icon icon={FaCloudUploadAlt} size={48} />
                    <h2>Нет треков</h2>
                    <p>Загрузите свой первый трек!</p>
                </div>
            ) : (
                <TrackList tracks={tracks} onTrackDelete={handleTrackDelete} showDeleteButton={true} />
            )}

            <UploadModal
                isOpen={isUploadModalOpen}
                onClose={() => {
                    setIsUploadModalOpen(false);
                    loadTracks();
                }}
                onSuccess={handleUploadSuccess}
            />
        </div>
    );
}; 