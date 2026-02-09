export interface Ingredient {
    id: string;
    name: string;
    brand: string;
    quantity: number;
    size: number;
    unit: string,
    unitLabel: string;
    expirationDate: Date;
    isExpired: boolean;
    mainCategory: string;
}