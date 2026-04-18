export const Unit = {
  Pcs: 'pcs',
  Ml: 'ml',
  L: 'L',
  G: 'g',
  Kg: 'kg',
} as const;

export type Unit = typeof Unit[keyof typeof Unit];


export const getUnitLabel = (val: string): string => {
    if (val === Unit.L) return 'L';
    return val; 
};