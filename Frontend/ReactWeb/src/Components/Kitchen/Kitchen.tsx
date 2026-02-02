import { useState } from "react";
import { dummyData } from "../../Data/DummyData";
import BottomKitchenToolBox from "./BottomKitchenToolBar";
import KitchenList from "./KitchenList";
import SearchBar from "./SearchBar";
import type { Ingredient } from "../../Data/Ingredient";
import { useNavigate } from "react-router-dom";

export default function Kitchen() {
    const [mode, setMode] = useState<string>("default"); // default/cooking
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    const data: Ingredient[] = dummyData;

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
        console.log("Cooking with:", selectedItems);
        setMode("default");
        setSelectedItems([]);
    };

    const filteredIngredients = data.
        filter(ingredient => ingredient.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div className="max-w-4xl mx-auto">
            <SearchBar 
                onSearchChange={setSearchQuery}
                searchQuery={searchQuery}
                onClickCookMode={handleCookModeClick}
                onClickCancelCookMode={handleCancelCooking}
                mode={mode}
            />
            <KitchenList 
                ingredients={filteredIngredients}
                mode={mode}
                itemsSelected={selectedItems}
                onItemHold={handleItemHold}
                onItemClick={handleItemClick}
            />
            <BottomKitchenToolBox 
                mode={mode}
                onCook={handleCook}
                onCancel={handleCancelCooking}
            />
        </div>
    );
}