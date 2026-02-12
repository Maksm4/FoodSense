import apiClient from "./apiClient";

export interface KitchenResponse {
    id: string;
    name: string;
    users: string[];
}

// DTO for the invite response
export interface InviteLinkResponse {
    inviteCode: string;
    expiresAt: string;
    createdByUserId: string;
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
    },

    generateInviteLink: async (kitchenId: string) => {
        const response = await apiClient.post<InviteLinkResponse>(
            `/kitchens/${kitchenId}/invite`, 
            null,
            { 
                params: { expirationHours: 24 }
            }
        );
        return response.data;
    },

    joinKitchen: async (inviteCode: string) => {
        await apiClient.post(
            '/kitchens/join',
            null,
            { 
                params: { inviteCode }
            }
        );
    }
};