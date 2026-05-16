const API_URL = 'http://localhost:5000/api';

// Types
export interface User {
    id: string;
    email: string;
    name: string;
    createdAt?: string;
}

export interface AuthResponse {
    message: string;
    token: string;
    user: User;
}

export interface EmotionRecord {
    _id: string;
    userId?: string;
    emotions: {
        happy?: number;
        sad?: number;
        angry?: number;
        surprised?: number;
        fearful?: number;
        disgusted?: number;
        neutral?: number;
    };
    dominantEmotion: string;
    confidence: number;
    mixedEmotion?: string;
    explanation?: string;
    suggestions?: string[];
    imageUrl?: string;
    aiSuggestion?: string;
    createdAt: string;
    updatedAt: string;
}

export interface EmotionStats {
    totalRecords: number;
    emotionCounts: Record<string, number>;
    averageConfidence: number;
    mostFrequentEmotion: string;
}

// Helper to get auth token
const getToken = (): string | null => {
    return localStorage.getItem('authToken');
};

// Helper to set auth token
export const setAuthToken = (token: string): void => {
    localStorage.setItem('authToken', token);
};

// Helper to remove auth token
export const removeAuthToken = (): void => {
    localStorage.removeItem('authToken');
};

// Helper to create auth headers
const getAuthHeaders = (): HeadersInit => {
    const token = getToken();
    return {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
    };
};

// Authentication API
export const authAPI = {
    /**
     * Register a new user
     */
    register: async (email: string, password: string, name: string): Promise<AuthResponse> => {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, name }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Registration failed');
        }

        const data = await response.json();
        setAuthToken(data.token);
        return data;
    },

    /**
     * Login a user
     */
    login: async (email: string, password: string): Promise<AuthResponse> => {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Login failed');
        }

        const data = await response.json();
        setAuthToken(data.token);
        return data;
    },

    /**
     * Get current user profile
     */
    getProfile: async (): Promise<{ user: User }> => {
        const response = await fetch(`${API_URL}/auth/profile`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to get profile');
        }

        return response.json();
    },

    /**
     * Logout user
     */
    logout: (): void => {
        removeAuthToken();
    },

    /**
     * Check if user is authenticated
     */
    isAuthenticated: (): boolean => {
        return !!getToken();
    },
};

export interface ChatInsight {
    _id: string;
    userId: string;
    userMessage: string;
    aiReply: string;
    emotionContext?: string;
    createdAt: string;
    updatedAt: string;
}

// Emotion API
export const emotionAPI = {
    /**
     * Create a new emotion record
     */
    createRecord: async (data: {
        emotions: Record<string, number>;
        dominantEmotion: string;
        confidence: number;
        imageUrl?: string;
        mixedEmotion?: string;
        explanation?: string;
        suggestions?: string[];
        aiSuggestion?: string;
    }): Promise<{ message: string; record: EmotionRecord }> => {
        const response = await fetch(`${API_URL}/emotions`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to create emotion record');
        }

        return response.json();
    },

    /**
     * Get all emotion records for the current user
     */
    getRecords: async (params?: {
        limit?: number;
        skip?: number;
    }): Promise<{
        records: EmotionRecord[];
        pagination: {
            total: number;
            limit: number;
            skip: number;
            hasMore: boolean;
        };
    }> => {
        const queryParams = new URLSearchParams();
        if (params?.limit) queryParams.append('limit', params.limit.toString());
        if (params?.skip) queryParams.append('skip', params.skip.toString());

        const response = await fetch(
            `${API_URL}/emotions?${queryParams.toString()}`,
            {
                method: 'GET',
                headers: getAuthHeaders(),
            }
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to get emotion records');
        }

        return response.json();
    },

    /**
     * Get emotion statistics
     */
    getStats: async (): Promise<{ stats: EmotionStats }> => {
        const response = await fetch(`${API_URL}/emotions/stats`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to get emotion statistics');
        }

        return response.json();
    },

    /**
     * Get stored chat insights
     */
    getChatInsights: async (): Promise<{ insights: ChatInsight[] }> => {
        const response = await fetch(`${API_URL}/chat/insights`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to get chat insights');
        }

        return response.json();
    },

    /**
     * Delete an emotion record
     */
    deleteRecord: async (id: string): Promise<{ message: string }> => {
        const response = await fetch(`${API_URL}/emotions/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to delete emotion record');
        }

        return response.json();
    },
};
