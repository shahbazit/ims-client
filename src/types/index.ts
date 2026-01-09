export interface LoginRequest {
    email: string;
    password: string;
}

export interface ApiUser {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    status: string; // The API returns this
}

export interface LoginResponse {
    token: string;
    expiration: string;
    user: ApiUser;
}

export interface User {
    id: string;
    fullName: string;
    email: string;
    role: string;
    status: string;
}

export interface CreateUserRequest {
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    role?: string;
    status?: string;
}

export interface UpdateUserRequest {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role?: string;
    status?: string;
    password?: string;
}
