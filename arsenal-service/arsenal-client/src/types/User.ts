export interface User {
    id: number;
    email: string;
    username?: string;
    firstName?: string;
    lastName?: string;
    middleName?: string;
    position?: string;
    department?: string;
    employeeId?: string;
    artist?: {
        id: number;
        name: string;
        userId: number;
    };
}

export interface AuthState {
    user: User | null;
    login: (email: string, password: string, remember?: boolean) => Promise<void>;
    register: (email: string, password: string, username: string) => Promise<void>;
    logout: () => void;
    restoreSession: () => void;
} 