import apiClient from "./apiClient";

export interface ProductResponse {
    id: string;
    name: string;
    brand: string;
    barCode: string;
    imageUrl: string;
}

export const productService = {
    search: async (query: string) => {
        const response = await apiClient.get<ProductResponse[]>(`/products`, {
            params: { search: query, limit: 10 }
        });
        return response.data;
    }
};