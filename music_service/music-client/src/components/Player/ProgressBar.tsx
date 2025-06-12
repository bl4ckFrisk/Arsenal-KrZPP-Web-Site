import React, { useRef } from 'react';
import { usePlayerStore } from '../../store/usePlayerStore';
import styles from './Player.module.css';

interface ProgressBarProps {
    audioRef: React.RefObject<HTMLAudioElement | null>;
}

export const ProgressBar = ({ audioRef }: ProgressBarProps) => {
    const { currentTime, duration } = usePlayerStore();
    const progressBarRef = useRef<HTMLDivElement>(null);

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const audio = audioRef.current;
        const progressBar = progressBarRef.current;
        
        if (!audio || !progressBar) return;

        const rect = progressBar.getBoundingClientRect();
        const clickPosition = e.clientX - rect.left;
        const percentage = clickPosition / rect.width;
        const newTime = percentage * duration;

        audio.currentTime = newTime;
    };

    const progress = duration ? (currentTime / duration) * 100 : 0;

    return (
        <div className={styles.progressContainer}>
            <span className={styles.time}>{formatTime(currentTime)}</span>
            <div 
                className={styles.progressBar} 
                ref={progressBarRef}
                onClick={handleProgressClick}
                title={`${formatTime(currentTime)} / ${formatTime(duration)}`}
            >
                <div 
                    className={styles.progress} 
                    style={{ width: `${progress}%` }}
                />
            </div>
            <span className={styles.time}>{formatTime(duration)}</span>
        </div>
    );
}; 