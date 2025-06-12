import { useState } from 'react';
import { usePlayerStore } from '../../store/usePlayerStore';
import styles from './Player.module.css';
import { FaVolumeMute, FaVolumeOff, FaVolumeDown, FaVolumeUp } from 'react-icons/fa';
import { Icon } from '../Icon/Icon';

export const VolumeControl = () => {
    const { volume, setVolume } = usePlayerStore();
    const [previousVolume, setPreviousVolume] = useState(volume);

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
    };

    const toggleMute = () => {
        if (volume > 0) {
            setPreviousVolume(volume);
            setVolume(0);
        } else {
            setVolume(previousVolume);
        }
    };

    const getVolumeIcon = () => {
        if (volume === 0) return FaVolumeMute;
        if (volume < 0.3) return FaVolumeOff;
        if (volume < 0.7) return FaVolumeDown;
        return FaVolumeUp;
    };

    return (
        <div className={styles.volumeControl}>
            <button 
                className={styles.muteButton}
                onClick={toggleMute}
                title={volume === 0 ? "Unmute" : "Mute"}
            >
                <Icon icon={getVolumeIcon()} size={20} />
            </button>
            <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className={styles.volumeSlider}
                style={{ 
                    '--volume-percentage': `${volume * 100}%` 
                } as React.CSSProperties}
                title={`Volume ${Math.round(volume * 100)}%`}
            />
        </div>
    );
}; 