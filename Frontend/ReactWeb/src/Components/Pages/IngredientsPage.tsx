import { useState } from "react";
import { dummyIngredientsData } from "../../Data/dummyIngredientsData";
import IngredientsToolBox from "../Ingredients/IngredientsToolBox";
import IngredientsList from "../Ingredients/IngredientsList";
import SearchBar from "../Ingredients/SearchBar";
import type { Ingredient } from "../../Data/Ingredient";
import { useNavigate } from "react-router-dom";
import Logout from "../Auth/Logout";

export default function IngredientsPage() {
    const [mode, setMode] = useState<string>("default"); // default/cooking
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    const data: Ingredient[] = dummyIngredientsData;

    function handleCookModeClick() {
        setMode("cooking");
    }

    //to trigger cooking mode 
    function handleItemHold (id: number) {
        setMode("cooking");
        setSelectedItems([...selectedItems, id])
    }

    function handleItemClick(id: number) {
        if (mode !== "cooking") return;

        setSelectedItems(prev => 
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    }

    const handleCancelCooking = () => {
        setMode("default");
        setSelectedItems([]);
    };

    const handleCook = () => {
        //nav to recipes
        const selectedIngredients = data.
            filter(ingredient => selectedItems.includes(ingredient.id));

        navigate('/recipes', {
            state: { ingredients: selectedIngredients }
        })
    };

    const filteredIngredients = data.
        filter(ingredient => ingredient.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div className="max-w-4xl mx-auto">
            <Logout ></Logout>
            <SearchBar 
                onSearchChange={setSearchQuery}
                searchQuery={searchQuery}
                onClickCookMode={handleCookModeClick}
                onClickCancelCookMode={handleCancelCooking}
                mode={mode}
            />
            <IngredientsList 
                ingredients={filteredIngredients}
                mode={mode}
                itemsSelected={selectedItems}
                onItemHold={handleItemHold}
                onItemClick={handleItemClick}
            />
            <IngredientsToolBox 
                mode={mode}
                onCook={handleCook}
                onCancel={handleCancelCooking}
            />
        </div>
    );
}