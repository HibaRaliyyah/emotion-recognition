import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI, User } from '../lib/api';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, name: string) => Promise<void>;
    logout: () => void;
    refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Load user profile on mount if token exists
    useEffect(() => {
        const loadUser = async () => {
            if (authAPI.isAuthenticated()) {
                try {
                    const { user } = await authAPI.getProfile();
                    setUser(user);
                } catch (error) {
                    console.error('Failed to load user:', error);
                    authAPI.logout();
                }
            }
            setIsLoading(false);
        };

        loadUser();
    }, []);

    const login = async (email: string, password: string) => {
        const { user } = await authAPI.login(email, password);
        setUser(user);
    };

    const register = async (email: string, password: string, name: string) => {
        const { user } = await authAPI.register(email, password, name);
        setUser(user);
    };

    const logout = () => {
        authAPI.logout();
        setUser(null);
    };

    const refreshProfile = async () => {
        if (authAPI.isAuthenticated()) {
            const { user } = await authAPI.getProfile();
            setUser(user);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                isLoading,
                login,
                register,
                logout,
                refreshProfile,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
