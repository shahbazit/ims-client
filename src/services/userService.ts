import { authHeader } from './http';
import type { User, CreateUserRequest, UpdateUserRequest } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const userService = {
    getAll: async (): Promise<User[]> => {
        try {
            const response = await fetch(`${API_BASE_URL}/Users`, {
                headers: authHeader()
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return data.map((user: any) => ({
                id: user.id,
                fullName: `${user.firstName} ${user.lastName}`,
                email: user.email,
                role: user.role || 'User',
                status: user.status || 'Active'
            }));
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
    },

    create: async (user: CreateUserRequest): Promise<void> => {
        try {
            const response = await fetch(`${API_BASE_URL}/Users`, {
                method: 'POST',
                headers: {
                    ...authHeader(),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || `HTTP error! status: ${response.status}`);
            }
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    },

    update: async (user: UpdateUserRequest): Promise<void> => {
        try {
            const response = await fetch(`${API_BASE_URL}/Users/${user.id}`, {
                method: 'PUT',
                headers: {
                    ...authHeader(),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || `HTTP error! status: ${response.status}`);
            }
        } catch (error) {
            console.error('Error updating user:', error);
            throw error;
        }
    },

    delete: async (id: string): Promise<void> => {
        try {
            const response = await fetch(`${API_BASE_URL}/Users/${id}`, {
                method: 'DELETE',
                headers: authHeader()
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || `HTTP error! status: ${response.status}`);
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            throw error;
        }
    },

};
