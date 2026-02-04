import apiClient from "./apiClient";

export interface KitchenResponse {
    id: string;
    name: string;
    users: string[];
}

export const kitchenService = {
    getAll: async () => {
        const response = await apiClient.get<KitchenResponse[]>('/kitchens');
        return response.data;
    },

    create: async (name: string) => {
        const response = await apiClient.post<KitchenResponse>('/kitchens', { name });
        return response.data;
    },

    delete: async (id: string) => {
        await apiClient.delete(`/kitchens/${id}`);
    }
};