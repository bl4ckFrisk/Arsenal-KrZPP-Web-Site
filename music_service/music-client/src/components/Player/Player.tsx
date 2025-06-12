import { useRef, useEffect } from 'react';
import { usePlayerStore } from '../../store/usePlayerStore';
import styles from './Player.module.css';
import { QueueList } from './QueueList';
import { PlayerControls } from './PlayerControls';
import { VolumeControl } from './VolumeControl';
import { ProgressBar } from './ProgressBar';
import { TrackInfo } from './TrackInfo';
import { BackgroundVisualizer } from './BackgroundVisualizer';

export const Player = () => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const {
        currentTrack,
        isPlaying,
        volume,
        isVisible,
        setCurrentTime,
        setDuration,
        setIsPlaying,
        playNext
    } = usePlayerStore();

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    useEffect(() => {
        if (audioRef.current) {
            if (isPlaying) {
                const playPromise = audioRef.current.play();
                if (playPromise !== undefined) {
                    playPromise.catch((error) => {
                        console.error('Error playing audio:', error);
                        setIsPlaying(false);
                    });
                }
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying, currentTrack, setIsPlaying]);

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
        }
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
            // Автоматически начинаем воспроизведение при загрузке метаданных
            if (isPlaying) {
                const playPromise = audioRef.current.play();
                if (playPromise !== undefined) {
                    playPromise.catch((error) => {
                        console.error('Error playing audio:', error);
                        setIsPlaying(false);
                    });
                }
            }
        }
    };

    const handleEnded = () => {
        playNext();
    };

    const handleError = (e: any) => {
        console.error('Audio error:', e);
        setIsPlaying(false);
    };

    if (!isVisible || !currentTrack) return null;

    return (
        <>
            <BackgroundVisualizer audioRef={audioRef} />
            <div className={styles.playerContainer}>
                <audio
                    ref={audioRef}
                    src={`http://localhost:3000/api/uploads/${currentTrack.filePath}`}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    onEnded={handleEnded}
                    onError={handleError}
                    preload="auto"
                />

                <div className={styles.mainContent}>
                    <div className={styles.leftSection}>
                        <TrackInfo track={currentTrack} />
                    </div>

                    <div className={styles.centerSection}>
                        <PlayerControls audioRef={audioRef} />
                        <ProgressBar audioRef={audioRef} />
                    </div>

                    <div className={styles.rightSection}>
                        <VolumeControl />
                        <QueueList />
                    </div>
                </div>
            </div>
        </>
    );
}; 