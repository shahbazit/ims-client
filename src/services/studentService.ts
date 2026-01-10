import { authHeader } from './http';
import type { Student, CreateStudentRequest, UpdateStudentRequest } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const studentService = {
    getAll: async (): Promise<Student[]> => {
        try {
            const response = await fetch(`${API_BASE_URL}/Students`, {
                headers: authHeader()
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return data.map((student: any) => ({
                id: student.id || student.Id || student.studentID || '',
                fullName: `${student.firstName} ${student.lastName}`,
                email: student.email,
                grade: student.grade || 'N/A',
                status: student.status || 'Active'
            }));
        } catch (error) {
            console.error('Error fetching students:', error);
            throw error;
        }
    },

    create: async (student: CreateStudentRequest): Promise<void> => {
        try {
            const response = await fetch(`${API_BASE_URL}/Students`, {
                method: 'POST',
                headers: {
                    ...authHeader(),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(student)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || `HTTP error! status: ${response.status}`);
            }
        } catch (error) {
            console.error('Error creating student:', error);
            throw error;
        }
    },

    update: async (student: UpdateStudentRequest): Promise<void> => {
        try {
            const { id, ...updateData } = student;

            const response = await fetch(`${API_BASE_URL}/Students/${id}`, {
                method: 'PUT',
                headers: {
                    ...authHeader(),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updateData)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || `HTTP error! status: ${response.status}`);
            }
        } catch (error) {
            console.error('Error updating student:', error);
            throw error;
        }
    },

    delete: async (id: string): Promise<void> => {
        try {
            const headers = authHeader();
            if (headers['Content-Type']) {
                delete headers['Content-Type'];
            }

            const response = await fetch(`${API_BASE_URL}/Students/${id}`, {
                method: 'DELETE',
                headers: headers
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || `HTTP error! status: ${response.status}`);
            }
        } catch (error) {
            console.error('Error deleting student:', error);
            throw error;
        }
    },
};
