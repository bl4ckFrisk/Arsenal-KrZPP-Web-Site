export interface Artist {
    id: number;
    name: string;
    // Add other artist fields as needed
}

export interface Track {
    id: number;
    title: string;
    artist: Artist;
    filePath: string;
    coverPath?: string;
    duration: number;
    // Add other track fields as needed
} 