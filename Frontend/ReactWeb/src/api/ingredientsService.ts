import { getUnitLabel } from "../Components/Ingredients/enums";
import type { Ingredient } from "../Data/Ingredient";
import apiClient from "./apiClient";

export interface UpdateIngredient {
    quantity?: number;
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
    categories: string[];
    brand: string;
    quantity: number;
    unit: number;
    expirationDate: string;
}

function mapDtoToModel(dto: ProductItemResponse): Ingredient {
    const expiry = new Date(dto.expirationDate);
    const lastCategory = dto.categories && dto.categories.length > 0 
        ? dto.categories.at(-1) || "" 
        : "";
    return {
        id: dto.id,
        name: dto.productName || "Unknown",
        quantity: dto.quantity,
        unit: dto.unit,
        brand: dto.brand,
        size: dto.productSize,
        unitLabel: getUnitLabel(dto.unit),
        expirationDate: expiry,
        isExpired: expiry < new Date(),
        mainCategory: lastCategory
    };
}


export const ingredientsService = {
    getAll: async (kitchenId: string) : Promise<Ingredient[]> => {
        const response = await apiClient.get<ProductItemResponse[]>(`/kitchens/${kitchenId}/items`);
        return response.data.map(mapDtoToModel);
    },

    updateItem: async (kitchenId: string, itemId: string, data: UpdateIngredient) : Promise<Ingredient> => {
        const response = await apiClient.patch<ProductItemResponse>(
            `/kitchens/${kitchenId}/items/${itemId}`, 
            data
        );
        
        return mapDtoToModel(response.data);
    },

    add: async (kitchenId: string, item: CreateProductItemRequest): Promise<Ingredient> => {
        const response = await apiClient.post(`/kitchens/${kitchenId}/items`, item);
        return mapDtoToModel(response.data);
    },

    delete: async (kitchenId: string, itemId: string) => {
        const response = await apiClient.delete(`/kitchens/${kitchenId}/items/${itemId}`);
        return response.data;
    }
};