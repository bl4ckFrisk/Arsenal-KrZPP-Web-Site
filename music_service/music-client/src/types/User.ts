export interface User {
    id: number;
    email: string;
    username?: string;
    nickname?: string;
    artist?: {
        id: number;
        name: string;
        userId: number;
    };
}

export interface AuthState {
    user: User | null;
    login: (email: string, password: string, remember?: boolean) => Promise<void>;
    register: (email: string, password: string, username: string, nickname: string) => Promise<void>;
    logout: () => void;
    restoreSession: () => void;
} 