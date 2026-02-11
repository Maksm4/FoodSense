import type { Unit } from "../Components/Ingredients/enums";

export interface Ingredient {
    id: string;
    name: string;
    brand: string;
    quantity: number;
    size: number;
    unit: Unit,
    unitLabel: string;
    expirationDate: Date;
    isExpired: boolean;
    mainCategory: string;
}