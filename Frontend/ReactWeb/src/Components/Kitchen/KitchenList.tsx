import type { Ingredient } from "../../Data/Ingredient";
import KitchenItem from "./KitchenItem";

interface KitchenListProps {
    ingredients: Ingredient[];
    mode: string,
    itemsSelected: number[],
    onItemHold: (id: number) => void;
    onItemClick: (id: number) => void;
}

export default function KitchenList({ingredients, onItemClick, onItemHold, itemsSelected, mode} : KitchenListProps) {

return (
    <div className="space-y-2">
      {ingredients.map(ingredient => (
        <KitchenItem 
          key={ingredient.id}
          ingredient={ingredient}
          mode={mode}
          isSelected={itemsSelected.includes(ingredient.id)}
          onHold={onItemHold}
          onClick={onItemClick}
        />
      ))}
    </div>
  );
}