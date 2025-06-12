import { create } from 'zustand';
import { Track } from '../types/Track';

interface PlayerState {
    currentTrack: Track | null;
    queue: Track[];
    isPlaying: boolean;
    volume: number;
    currentTime: number;
    duration: number;
    isVisible: boolean;
    isShuffleOn: boolean;
    isRepeatOn: boolean;

    // Actions
    setCurrentTrack: (track: Track | null) => void;
    setQueue: (tracks: Track[]) => void;
    addToQueue: (track: Track) => void;
    removeFromQueue: (trackId: number) => void;
    setIsPlaying: (isPlaying: boolean) => void;
    setVolume: (volume: number) => void;
    setCurrentTime: (time: number) => void;
    setDuration: (duration: number) => void;
    setIsVisible: (isVisible: boolean) => void;
    playNext: () => void;
    playPrevious: () => void;
    toggleShuffle: () => void;
    toggleRepeat: () => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
    currentTrack: null,
    queue: [],
    isPlaying: false,
    volume: 1,
    currentTime: 0,
    duration: 0,
    isVisible: false,
    isShuffleOn: false,
    isRepeatOn: false,

    setCurrentTrack: (track) => {
        set({ 
            currentTrack: track, 
            isVisible: track !== null,
            isPlaying: track !== null
        });
        if (track && !get().queue.some(t => t.id === track.id)) {
            get().addToQueue(track);
        }
    },

    setQueue: (tracks) => set({ queue: tracks }),

    addToQueue: (track) => set((state) => ({ 
        queue: [...state.queue, track] 
    })),

    removeFromQueue: (trackId) => set((state) => ({
        queue: state.queue.filter(track => track.id !== trackId)
    })),

    setIsPlaying: (isPlaying) => set({ isPlaying }),

    setVolume: (volume) => set({ volume }),

    setCurrentTime: (time) => set({ currentTime: time }),

    setDuration: (duration) => set({ duration }),

    setIsVisible: (isVisible) => set({ isVisible }),

    playNext: () => {
        const { queue, currentTrack, isRepeatOn, isShuffleOn } = get();
        if (!currentTrack || queue.length <= 1) return;

        const currentIndex = queue.findIndex(track => track.id === currentTrack.id);
        let nextIndex;

        if (isShuffleOn) {
            nextIndex = Math.floor(Math.random() * queue.length);
            while (nextIndex === currentIndex && queue.length > 1) {
                nextIndex = Math.floor(Math.random() * queue.length);
            }
        } else {
            nextIndex = currentIndex + 1;
            if (nextIndex >= queue.length && isRepeatOn) {
                nextIndex = 0;
            }
        }

        if (nextIndex < queue.length) {
            set({ currentTrack: queue[nextIndex] });
        }
    },

    playPrevious: () => {
        const { queue, currentTrack } = get();
        if (!currentTrack || queue.length <= 1) return;

        const currentIndex = queue.findIndex(track => track.id === currentTrack.id);
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : queue.length - 1;
        
        set({ currentTrack: queue[prevIndex] });
    },

    toggleShuffle: () => set((state) => ({ 
        isShuffleOn: !state.isShuffleOn 
    })),

    toggleRepeat: () => set((state) => ({ 
        isRepeatOn: !state.isRepeatOn 
    }))
})); 