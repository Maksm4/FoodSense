import { useRef } from "react";
import type { Ingredient } from "../../Data/Ingredient";
import { Badge, type BadgeColor } from "../UI/Badge";
import { Card } from "../UI/Card";
import { getUnitLabel } from "./enums";

interface IngredientItemProps {
    ingredient: Ingredient;
    mode: string,
    isSelected: boolean,
    onHold: (id: string) => void;
    onClick: (id: string) => void;
    onQuantityChange: (itemId: string, newAmount: number) => void;
    onDelete: (id: string) => void;
}

export default function IngredientItem({
    ingredient, 
    onClick, 
    onHold, 
    onDelete, 
    onQuantityChange, 
    mode, 
    isSelected
}: IngredientItemProps) {
    const holdTimerRef = useRef<number>(0);
    const wasHoldRef = useRef(false);

    const getDaysUntilExpiry = () => {
        const today = new Date();
        const expiry = new Date(ingredient.expirationDate);
        return Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    };

    const days = getDaysUntilExpiry();

    const getBadgeColor = (d: number): BadgeColor => {
        if (d < 3) return "danger";
        if (d <= 7) return "medium";
        return "safe";
    };

    const handleTouchStart = () => {
        if (mode === "default") {
            wasHoldRef.current = false;
            holdTimerRef.current = setTimeout(() => {
                wasHoldRef.current = true;
                onHold(ingredient.id);
            }, 500);
        }
    };

    const handleTouchEnd = () => {
        if (holdTimerRef.current) {
            clearTimeout(holdTimerRef.current);
            holdTimerRef.current = 0;
        }
    };

    const handleClick = () => {
        if (mode === "cooking" && !wasHoldRef.current) {
            onClick(ingredient.id);
        }
         wasHoldRef.current = false;
    };

    const handleIncrease = (e: React.MouseEvent) => {
        e.stopPropagation();
        onQuantityChange(ingredient.id, ingredient.quantity + 1);
    };

    const handleDecrease = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (ingredient.quantity > 1) {
            onQuantityChange(ingredient.id, ingredient.quantity - 1);
        }
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        onDelete(ingredient.id);
    };

    const getSubtitle = () => {
        const label = ingredient.unitLabel;
        if (ingredient.unit === 0) {
            return `${ingredient.quantity} ${label}`;
        }
        return `${ingredient.quantity} • ${ingredient.size} ${label}`;
    };

    return (
        <Card
            title={ingredient.name}
            subtitle={getSubtitle()}
            isSelected={isSelected} 
            className="select-none relative"
            
            action={
                <div className="flex flex-col items-end justify-between h-full min-h-50px gap-2">
                    <Badge 
                        text={`${days} days`} 
                        color={getBadgeColor(days)} 
                    />

                    <div className="flex items-center gap-1 mt-auto">
                        <button 
                            onClick={handleDecrease}
                            disabled={ingredient.quantity <= 1}
                            className={`w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors ${ingredient.quantity <= 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
                        </button>

                        <button 
                            onClick={handleIncrease}
                            className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        </button>

                        <div className="w-px h-4 bg-gray-300 mx-1"></div>

                        <button 
                            onClick={handleDelete}
                            className="w-7 h-7 flex items-center justify-center rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                            title="Delete Item"
                        >
                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            }

            onClick={handleClick}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleTouchStart}
            onMouseUp={handleTouchEnd}
            onMouseLeave={handleTouchEnd}
        />
    );
}