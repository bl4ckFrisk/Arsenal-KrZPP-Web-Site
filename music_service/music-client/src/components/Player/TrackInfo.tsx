import { Track } from '../../types/Track';
import styles from './Player.module.css';

interface TrackInfoProps {
    track: Track;
}

export const TrackInfo = ({ track }: TrackInfoProps) => {
    return (
        <div className={styles.trackInfo}>
            {track.coverPath && (
                <img 
                    src={`/api/uploads/${track.coverPath}`}
                    alt={track.title}
                    className={styles.coverImage}
                    onError={(e) => {
                        console.error('Error loading cover image:', e);
                        e.currentTarget.style.display = 'none';
                    }}
                />
            )}
            <div className={styles.trackDetails}>
                <div className={styles.trackTitle}>{track.title}</div>
                <div className={styles.artistName}>{track.artist.name}</div>
            </div>
        </div>
    );
}; 