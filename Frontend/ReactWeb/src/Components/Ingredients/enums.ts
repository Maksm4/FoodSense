export const UNITS = [
    { id: 0, label: "pcs" }, 
    { id: 1, label: "ml" },
    { id: 2, label: "L" },
    { id: 3, label: "g" },
    { id: 4, label: "kg" },
];

export const getUnitLabel = (id: number) => {
    return UNITS.find(u => u.id === id)?.label || "";
};