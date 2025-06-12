import React, { useState } from 'react';
import { usePlayerStore } from '../../store/usePlayerStore';
import apiClient from '../../api/client';
import styles from './TrackList.module.css';
import { Track } from '../../types/Track';

interface TrackListProps {
    tracks: Track[];
    onTrackDelete?: (trackId: number) => void;
    showDeleteButton?: boolean;
}

export const TrackList = ({ tracks, onTrackDelete, showDeleteButton = false }: TrackListProps) => {
    const { setCurrentTrack, setQueue, currentTrack } = usePlayerStore();
    const [isDeleting, setIsDeleting] = useState<number | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [trackToDelete, setTrackToDelete] = useState<Track | null>(null);

    console.log('Tracks in TrackList:', tracks);

    const handlePlayTrack = (track: Track) => {
        console.log('Playing track:', track);
        setQueue(tracks);
        setCurrentTrack(track);
    };

    const handleDeleteClick = (track: Track) => {
        setTrackToDelete(track);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        if (!trackToDelete) return;

        try {
            setIsDeleting(trackToDelete.id);
            console.log('Deleting track:', trackToDelete.id);
            const response = await apiClient.delete(`tracks/${trackToDelete.id}`);
            console.log('Delete response:', response);
            
            // If this was the current track playing, clear it
            if (currentTrack?.id === trackToDelete.id) {
                setCurrentTrack(null);
            }
            
            // Update the parent component
            if (onTrackDelete) {
                await onTrackDelete(trackToDelete.id);
            }
        } catch (error: any) {
            console.error('Failed to delete track:', error.response || error);
            alert(error.response?.data?.message || 'Failed to delete track. Please try again later.');
        } finally {
            setIsDeleting(null);
            setShowDeleteModal(false);
            setTrackToDelete(null);
        }
    };

    const handleCancelDelete = () => {
        setShowDeleteModal(false);
        setTrackToDelete(null);
    };

    return (
        <>
            <div className={styles.trackList}>
                {tracks.map((track) => (
                    <div key={track.id} className={styles.trackItem}>
                        <div className={styles.trackInfo} onClick={() => handlePlayTrack(track)}>
                            {track.coverPath && (
                                <img 
                                    src={`http://localhost:3000/api/uploads/${track.coverPath}`}
                                    alt={track.title}
                                    className={styles.coverImage}
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                    }}
                                />
                            )}
                            <div className={styles.trackDetails}>
                                <div className={styles.trackTitle}>{track.title}</div>
                                <div className={styles.artistName}>{track.artist.name}</div>
                            </div>
                        </div>
                        <div className={styles.trackActions}>
                            {/* <button 
                                className={styles.playButton}
                                onClick={() => handlePlayTrack(track)}
                            >
                                Слушать
                            </button> */}
                            {showDeleteButton && onTrackDelete && (
                                <button 
                                    className={`${styles.deleteButton} ${isDeleting === track.id ? styles.deleting : ''}`}
                                    onClick={() => handleDeleteClick(track)}
                                    disabled={isDeleting === track.id}
                                >
                                    {isDeleting === track.id ? 'Удаление...' : 'Удалить'}
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {showDeleteModal && trackToDelete && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h3>Удаление трека</h3>
                        <p>Вы уверены, что хотите удалить трек "{trackToDelete.title}"?</p>
                        <p>Это действие нельзя будет отменить.</p>
                        <div className={styles.modalActions}>
                            <button 
                                className={styles.cancelButton}
                                onClick={handleCancelDelete}
                            >
                                Отмена
                            </button>
                            <button 
                                className={styles.confirmButton}
                                onClick={handleConfirmDelete}
                            >
                                Удалить
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}; 