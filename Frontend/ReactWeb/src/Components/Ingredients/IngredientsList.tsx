import type { Ingredient } from "../../Data/Ingredient";
import IngredientItem from "./IngredientItem";

interface IngredientsListProps {
    ingredients: Ingredient[];
    mode: string,
    itemsSelected: number[],
    onItemHold: (id: number) => void;
    onItemClick: (id: number) => void;
}

export default function IngredientsList({ingredients, onItemClick, onItemHold, itemsSelected, mode} : IngredientsListProps) {

return (
    <div className="space-y-2">
      {ingredients.map(ingredient => (
        <IngredientItem 
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