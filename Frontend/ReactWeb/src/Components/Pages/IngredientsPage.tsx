import { useCallback, useEffect, useState } from "react";
import IngredientsToolBox from "../Ingredients/IngredientsToolBox";
import IngredientsList from "../Ingredients/IngredientsList";
import SearchBar from "../Ingredients/SearchBar";
import type { Ingredient } from "../../Data/Ingredient";
import { useNavigate, useParams } from "react-router-dom";
import { PageContainer } from "../UI/PageContainer";
import { ingredientsService } from "../../api/ingredientsService";
import AddItemPopup from "../Ingredients/AddItemPopup";
import ProfilePopup from "../Profile/ProfilePopup";
import RecipeFilterPopup from "../Recipe/RecipesFilterPopup";
import type { MealType, CuisineType } from "../../Data/Recipe";

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
        } catch {
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
    function handleItemHold(id: string) {
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
        try {
            await ingredientsService.delete(kitchenId, id);
            setIngredients(prevData => prevData.filter(item => item.id !== id));
        } catch {
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

        } catch {
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

    const handleCookWithFilters = (filters: { mealType?: MealType; cuisineType?: CuisineType }) => {
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
        <>
            {/* Cooking Mode Overlay*/}
            {mode === "cooking" && (
                <div className="fixed inset-0 bg-primary/5 backdrop-blur-[2px] pointer-events-none z-0">
                    <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-safe/10"></div>
                </div>
            )}

            <PageContainer>
                <div className="relative z-10">
                    <div className="mb-6">
                        <div className="flex items-center gap-3 mb-4">
                            {/* Back Button */}
                            <button
                                onClick={() => navigate('/kitchens')}
                                className="shrink-0 w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                <i className="fa-solid fa-arrow-left"></i>
                            </button>

                            {/* Search Bar */}
                            <div className="flex-1">
                                <SearchBar
                                    onSearchChange={setSearchQuery}
                                    searchQuery={searchQuery}
                                    onClickCookMode={handleCookModeClick}
                                    onClickCancelCookMode={handleCancelCooking}
                                    mode={mode}
                                />
                            </div>

                            {/* Select Button (Desktop Only) */}
                            {mode === "default" && (
                                <button
                                    onClick={handleCookModeClick}
                                    className="hidden md:flex shrink-0 items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl font-semibold hover:bg-primary-hover transition-all shadow-lg shadow-primary/20"
                                >
                                    <i className="fa-solid fa-hand-pointer"></i>
                                    <span>Select</span>
                                </button>
                            )}

                            {/* Cancel Button (When in cooking mode - Desktop) */}
                            {mode === "cooking" && (
                                <button
                                    onClick={handleCancelCooking}
                                    className="hidden md:flex shrink-0 items-center gap-2 px-4 py-2 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                                >
                                    <i className="fa-solid fa-xmark"></i>
                                    <span>Cancel</span>
                                </button>
                            )}

                            {/* Profile Button*/}
                            <div className="shrink-0">
                                <ProfilePopup userName="" />
                            </div>
                        </div>

                        {/* Cooking Mode Indicator Banner */}
                        {mode === "cooking" && (
                            <div className="bg-linear-to-r from-primary/20 via-safe/20 to-primary/20 border-2 border-primary/30 rounded-2xl p-4 animate-in slide-in-from-top-2 duration-300">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                                            <i className="fa-solid fa-utensils text-white"></i>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-800">Cooking Mode Active</h3>
                                            <p className="text-sm text-gray-600">
                                                {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
                                            </p>
                                        </div>
                                    </div>

                                    {/* Mobile Cancel Button */}
                                    <button
                                        onClick={handleCancelCooking}
                                        className="md:hidden px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
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
                </div>
            </PageContainer>
        </>
    );
}