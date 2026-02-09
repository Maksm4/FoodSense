import { useCallback, useEffect, useState } from "react";
import IngredientsToolBox from "../Ingredients/IngredientsToolBox";
import IngredientsList from "../Ingredients/IngredientsList";
import SearchBar from "../Ingredients/SearchBar";
import type { Ingredient } from "../../Data/Ingredient";
import { useNavigate, useParams } from "react-router-dom";
import { PageContainer } from "../UI/PageContainer";
import { ingredientsService } from "../../api/ingredientsService";
import { Button } from "../UI/Button";
import AddItemPopup from "../Ingredients/AddItemPopup";
import ProfilePopup from "../Profile/ProfilePopup";
import RecipeFilterPopup from "../Recipe/RecipesFilterPopup";

export default function IngredientsPage() {
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const [mode, setMode] = useState<string>("default"); // default/cooking
    const [selectedItems, setSelectedItems] = useState<string[]>([]);

    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isAddItemOpen, setIsAddItemOpen] = useState(false);

    const { kitchenId } = useParams();

    //load kitchens items
    const loadData = useCallback(async () => {
        if (!kitchenId) return;

        try {
            setIsLoading(true);
            const data = await ingredientsService.getAll(kitchenId);
            setIngredients(data);
        } catch (_) {
            setError("Could not load kitchen inventory.");
        } finally {
            setIsLoading(false);
        }
    }, [kitchenId]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    function handleCookModeClick() {
        setMode("cooking");
    }

    //to trigger cooking mode 
    function handleItemHold (id: string) {
        setMode("cooking");
        setSelectedItems([...selectedItems, id])
    }

    function handleItemClick(id: string) {
        if (mode !== "cooking") return;

        setSelectedItems(prev => 
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    }

    async function handleItemDelete(id: string) {
        if (!kitchenId) return;
        try 
        {
            await ingredientsService.delete(kitchenId, id);
            setIngredients(prevData => prevData.filter(item => item.id !== id));
        }catch(_)
        {
            setError("Failed to delete item");
        }
    }

    async function handleUpdateQuantity(itemId: string, newAmount: number) {
        try {
            if (!kitchenId) return;

            await ingredientsService.updateItem(
                kitchenId, 
                itemId,
                { quantity: newAmount }
            );

            setIngredients(prevData => prevData.map(item => 
                item.id === itemId ? { ...item, quantity: newAmount } : item
            ));

        } catch (_) {
            setError("Failed to update quantity");
        }
    }

    const handleCancelCooking = () => {
        setMode("default");
        setSelectedItems([]);
    };

    const handleCook = () => {
        setIsFilterOpen(true);
    };

    const handleCookWithFilters = (filters: { mealType?: string; cuisineType?: string }) => {
        const selectedIngredients = ingredients.filter(ingredient => 
            selectedItems.includes(ingredient.id)
        );

        navigate('/recipes', {
            state: { 
                ingredients: selectedIngredients, 
                kitchenId: kitchenId,
                filters: filters
            }
        });

        setIsFilterOpen(false);
    };

    const filteredIngredients = ingredients.
        filter(ingredient => (ingredient.name || "").toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <PageContainer>
            <div className="flex justify-between items-center mb-4">
                <Button
                    variant="secondary"
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    onClick={() => navigate('/kitchens')}
                >
                <i className="fa-solid fa-left-long"></i>
                </Button>
                <SearchBar
                    onSearchChange={setSearchQuery}
                    searchQuery={searchQuery}
                    onClickCookMode={handleCookModeClick}
                    onClickCancelCookMode={handleCancelCooking}
                    mode={mode}
                />
                <ProfilePopup userName=""></ProfilePopup>
            </div>
            <IngredientsList 
                ingredients={filteredIngredients}
                mode={mode}
                itemsSelected={selectedItems}
                onItemHold={handleItemHold}
                onItemClick={handleItemClick}
                onItemDelete={handleItemDelete}
                onItemQuantityChange={handleUpdateQuantity}
            />
            <IngredientsToolBox 
                mode={mode}
                onCook={handleCook}
                onCancel={handleCancelCooking}
                onAdd={() => setIsAddItemOpen(true)}
            />
            <AddItemPopup
                isOpen={isAddItemOpen}
                onClose={() => setIsAddItemOpen(false)}
                onAdded={loadData}
                kitchenId={kitchenId!} 
            />
            <RecipeFilterPopup
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                onCook={handleCookWithFilters}
            />
        </PageContainer>
    );
}