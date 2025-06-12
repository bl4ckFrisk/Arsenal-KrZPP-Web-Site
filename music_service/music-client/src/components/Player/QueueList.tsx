import { useState } from 'react';
import { usePlayerStore } from '../../store/usePlayerStore';
import styles from './Player.module.css';
import { FaList, FaTimes } from 'react-icons/fa';
import { Icon } from '../Icon/Icon';

export const QueueList = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { queue, currentTrack, setCurrentTrack, removeFromQueue } = usePlayerStore();

    const toggleQueue = () => setIsOpen(!isOpen);

    return (
        <div className={styles.queueContainer}>
            <button 
                className={`${styles.queueButton} ${isOpen ? styles.active : ''}`}
                onClick={toggleQueue}
            >
                <Icon icon={FaList} size={20} />
            </button>

            {isOpen && (
                <div className={styles.queueList}>
                    <div className={styles.queueHeader}>
                        <h3>Очередь</h3>
                        <span>{queue.length} треков</span>
                    </div>
                    
                    <div className={styles.queueItems}>
                        {queue.map((track) => (
                            <div 
                                key={track.id} 
                                className={`${styles.queueItem} ${currentTrack?.id === track.id ? styles.active : ''}`}
                            >
                                <div 
                                    className={styles.queueItemInfo}
                                    onClick={() => setCurrentTrack(track)}
                                >
                                    {track.coverPath && (
                                        <img 
                                            src={`/api/uploads/${track.coverPath}`}
                                            alt={track.title}
                                            className={styles.queueItemCover}
                                        />
                                    )}
                                    <div className={styles.queueItemDetails}>
                                        <div className={styles.queueItemTitle}>{track.title}</div>
                                        <div className={styles.queueItemArtist}>{track.artist.name}</div>
                                    </div>
                                </div>
                                
                                <button 
                                    className={styles.removeButton}
                                    onClick={() => removeFromQueue(track.id)}
                                >
                                    <Icon icon={FaTimes} size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}; 