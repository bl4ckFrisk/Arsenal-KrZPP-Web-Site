export interface Artist {
    id: number;
    name: string;
    avatar?: string;
}

export interface Track {
    id: number;
    title: string;
    artist: Artist;
    filePath: string;
    coverPath?: string;
    duration: number;
    createdAt: string;
    updatedAt: string;
} 