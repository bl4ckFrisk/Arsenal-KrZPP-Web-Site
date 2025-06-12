import { RefObject } from 'react';
import { usePlayerStore } from '../../store/usePlayerStore';
import styles from './Player.module.css';
import { FaRandom, FaStepBackward, FaPlay, FaPause, FaStepForward, FaRedo } from 'react-icons/fa';
import { Icon } from '../Icon/Icon';

interface PlayerControlsProps {
    audioRef: RefObject<HTMLAudioElement | null>;
}

export const PlayerControls = ({ audioRef }: PlayerControlsProps) => {
    const { 
        isPlaying, 
        setIsPlaying,
        playPrevious,
        playNext,
        isShuffleOn,
        isRepeatOn,
        toggleShuffle,
        toggleRepeat
    } = usePlayerStore();

    const handlePlayPause = () => {
        setIsPlaying(!isPlaying);
    };

    return (
        <div className={styles.controls}>
            <button 
                className={`${styles.controlButton} ${isShuffleOn ? styles.active : ''}`}
                onClick={toggleShuffle}
                title="Shuffle"
            >
                <Icon icon={FaRandom} size={16} />
            </button>
            
            <button 
                className={styles.controlButton}
                onClick={playPrevious}
                title="Previous"
            >
                <Icon icon={FaStepBackward} size={16} />
            </button>

            <button 
                className={`${styles.controlButton} ${styles.playButton}`}
                onClick={handlePlayPause}
                title={isPlaying ? "Pause" : "Play"}
            >
                <Icon icon={isPlaying ? FaPause : FaPlay} size={20} />
            </button>

            <button 
                className={styles.controlButton}
                onClick={playNext}
                title="Next"
            >
                <Icon icon={FaStepForward} size={16} />
            </button>

            <button 
                className={`${styles.controlButton} ${isRepeatOn ? styles.active : ''}`}
                onClick={toggleRepeat}
                title="Repeat"
            >
                <Icon icon={FaRedo} size={16} />
            </button>
        </div>
    );
}; 