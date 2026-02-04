import type { Ingredient } from "../Data/Ingredient";
import apiClient from "./apiClient";

export interface UpdateIngredient {
    amount?: number;
    expiryDate?: string;
}
export interface CreateProductItemRequest {
    productId: string;
    quantity: number;
    price: number;
    purchaseDate: string;
    expirationDate: string;
    productSize: number;
    unit: number;
}

export interface ProductItemResponse {
    id: string;
    productName: string;
    productSize: number;
    brand: string;
    quantity: number;
    unit: number;
    expirationDate: string;
}

export const ingredientsService = {
    getAll: async (kitchenId: string) => {
        const response = await apiClient.get<Ingredient[]>(`/kitchens/${kitchenId}/items`);
        return response.data;
    },

    updateItem: async (kitchenId: string, itemId: string, data: UpdateIngredient) => {
        const response = await apiClient.patch<ProductItemResponse>(
            `/kitchens/${kitchenId}/items/${itemId}`, 
            data
        );
        
        return response.data;
    },

    add: async (kitchenId: string, item: CreateProductItemRequest) => {
        const response = await apiClient.post(`/kitchens/${kitchenId}/items`, item);
        return response.data;
    }
};