import { create } from 'zustand';
import { Track } from '../types/Track';

interface PlayerState {
    currentTrack: Track | null;
    isPlaying: boolean;
    currentTime: number;
    duration: number;
    volume: number;
    setCurrentTrack: (track: Track | null) => void;
    setIsPlaying: (isPlaying: boolean) => void;
    setCurrentTime: (time: number) => void;
    setDuration: (duration: number) => void;
    setVolume: (volume: number) => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
    currentTrack: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    setCurrentTrack: (track) => set({ currentTrack: track, currentTime: 0, duration: track?.duration || 0 }),
    setIsPlaying: (isPlaying) => set({ isPlaying }),
    setCurrentTime: (currentTime) => set({ currentTime }),
    setDuration: (duration) => set({ duration }),
    setVolume: (volume) => set({ volume }),
})); 