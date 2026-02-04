import type { Ingredient } from "../../Data/Ingredient";
import { Grid } from "../UI/Grid";
import IngredientItem from "./IngredientItem";

interface IngredientsListProps {
    ingredients: Ingredient[];
    mode: string,
    itemsSelected: string[],
    onItemHold: (id: string) => void;
    onItemClick: (id: string) => void;
    onItemQuantityChange: (itemId: string, newAmount: number) => void;
    onItemDelete: (id: string) => void;
}

export default function IngredientsList({ingredients, onItemClick, onItemHold, onItemDelete, onItemQuantityChange, itemsSelected, mode} : IngredientsListProps) {

return (
    <Grid>
      {ingredients.map(ingredient => (
        <IngredientItem 
          key={ingredient.id}
          ingredient={ingredient}
          mode={mode}
          isSelected={itemsSelected.includes(ingredient.id)}
          onHold={onItemHold}
          onClick={onItemClick}
          onDelete={onItemDelete}
          onQuantityChange={onItemQuantityChange}
        />
      ))}
    </Grid>
  );
}