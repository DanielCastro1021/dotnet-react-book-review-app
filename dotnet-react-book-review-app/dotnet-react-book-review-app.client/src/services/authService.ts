import axios from 'axios';

// Use relative URL since Vite proxy will handle routing to the backend
const API_BASE_URL = '';

const authApi = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add interceptor to include JWT token in requests
authApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Types
export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
}

export interface AuthResponse {
    token: string;
    email: string;
    firstName: string;
    lastName: string;
    userId: string;
    expires: string;
}

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
}

// Authentication Services
export const authService = {
    login: (loginData: LoginRequest) => authApi.post<AuthResponse>('/api/Account/login', loginData),
    register: (registerData: RegisterRequest) => authApi.post<AuthResponse>('/api/Account/register', registerData),
    logout: () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
    },
    getCurrentUser: (): User | null => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },
    isAuthenticated: (): boolean => {
        const token = localStorage.getItem('authToken');
        if (!token) return false;
        
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const currentTime = Date.now() / 1000;
            return payload.exp > currentTime;
        } catch {
            return false;
        }
    },
    setAuthData: (authResponse: AuthResponse) => {
        localStorage.setItem('authToken', authResponse.token);
        localStorage.setItem('user', JSON.stringify({
            id: authResponse.userId,
            email: authResponse.email,
            firstName: authResponse.firstName,
            lastName: authResponse.lastName
        }));
    },
    forgotPassword: (email: string) => authApi.post('/api/Account/forgot-password', { email }),
    resetPassword: (token: string, newPassword: string) => 
        authApi.post('/api/Account/reset-password', { token, newPassword }),
    changePassword: (oldPassword: string, newPassword: string) => 
        authApi.post('/api/Account/change-password', { oldPassword, newPassword }),
};

export default authApi;
