import { useRef } from "react";
import type { Ingredient } from "../../Data/Ingredient";

interface KitchenItemProps {
    ingredient: Ingredient;
    mode: string,
    isSelected: boolean,
    onHold: (id: number) => void;
    onClick: (id: number) => void;
}

export default function KitchenItem({ingredient, onClick, onHold, mode, isSelected}: KitchenItemProps) {
    const holdTimerRef = useRef<number>(0);
    const wasHoldRef = useRef(false); //to not unclick when holding

    const getDaysUntilExpiry = () => {
        const today = new Date();
        const expiry = new Date(ingredient.expiryDate);
        return Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    };

    const daysToExpiry = getDaysUntilExpiry();
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

     return (
    <div 
      className={`flex rounded overflow-hidden border cursor-pointer ${isSelected ? 'ring-2 ring-blue-800' : ''}`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleTouchStart}
      onMouseUp={handleTouchEnd}
      onMouseLeave={handleTouchEnd}
      onClick={handleClick}
    >
      <div className={`flex-4 p-4 ${isSelected ? 'bg-blue-200' : ' bg-white'}`}>
        <div>
          <p>{ingredient.name}</p>
        </div>
        <div>
          <p className="font-medium text-gray-500">
            {ingredient.amount} {ingredient.unitCapacity == 0 ? "pieces" : " • " + ingredient.unitCapacity} {ingredient.unit}
          </p>
        </div>
      </div>
      <div className={`flex-1 ${getStatusColor(daysToExpiry)} flex items-center justify-center text-white font-semibold`}>
        {daysToExpiry} days
      </div>
    </div>
  );
}

function getExpiryStatus(days: number) {
    if (days < 3) return "danger";
    if (days <= 7) return "medium";
    return "safe";
}

function getStatusColor(days: number) {
    const status = getExpiryStatus(days);
    switch (status) {
    case "danger":
        return "bg-[#E07A5F]";
    case "medium":
        return "bg-[#F4A261]";
    case "safe":
        return "bg-[#81B29A]";
    default:
        return "bg-gray-400";
    }
};