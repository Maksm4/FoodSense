import apiClient from "./apiClient";

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
}

export interface RegisterRequest {
    email: string;
    username: string;
    password: string;
    confirmPassword: string;
}


export interface RegisterResponse {
    message: string;
}

export const authService = {
    login: async (credentials: LoginRequest) => {
        const response = await apiClient.post<LoginResponse>('/login', credentials);
        return response.data;
    },

    register: async (data: RegisterRequest) => {
        const response = await apiClient.post<RegisterResponse>('/register', data);
        return response.data;
    }
};