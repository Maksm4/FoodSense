export interface Ingredient {
    id: string;
    name: string;
    brand: string;
    quantity: number;
    size: number;
    unit: number,
    unitLabel: string;
    expirationDate: Date;
    isExpired: boolean;
}