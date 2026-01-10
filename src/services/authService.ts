const API_BASE_URL = '/api';

import type { LoginRequest, LoginResponse, CreateUserRequest } from '../types';

export const authService = {
    login: async (request: LoginRequest): Promise<LoginResponse> => {
        const response = await fetch(`${API_BASE_URL}/Auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'accept': '*/*'
            },
            body: JSON.stringify(request)
        });

        if (!response.ok) {
            throw new Error('Login failed');
        }

        const data = await response.json();
        if (data.token) {
            localStorage.setItem('token', data.token);
            // Store user details if needed, e.g. localStorage.setItem('user', JSON.stringify(data.user));
        }
        return data;
    },

    register: async (request: CreateUserRequest): Promise<void> => {
        const response = await fetch(`${API_BASE_URL}/Auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'accept': '*/*'
            },
            body: JSON.stringify(request)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Registration failed');
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        // localStorage.removeItem('user');
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    }
};
