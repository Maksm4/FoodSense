import { useState } from "react";
import { MealType, CuisineType } from "../../Data/Recipe";

interface RecipeFilterPopupProps {
    isOpen: boolean;
    onClose: () => void;
    onCook: (filters: { mealType?: MealType; cuisineType?: CuisineType }) => void;
}

const mealTypeDisplay: Record<MealType, { label: string; icon: string }> = {
    [MealType.Breakfast]: { label: 'Breakfast', icon: 'fa-mug-hot' },
    [MealType.Lunch]: { label: 'Lunch', icon: 'fa-burger' },
    [MealType.Dinner]: { label: 'Dinner', icon: 'fa-utensils' },
    [MealType.Snack]: { label: 'Snack', icon: 'fa-cookie-bite' },
    [MealType.Teatime]: { label: 'Tea Time', icon: 'fa-mug-saucer' },
};

const cuisineTypeDisplay: Record<CuisineType, { label: string; icon: string }> = {
    [CuisineType.American]: { label: 'American', icon: 'fa-burger' },
    [CuisineType.Italian]: { label: 'Italian', icon: 'fa-pizza-slice' },
    [CuisineType.Mexican]: { label: 'Mexican', icon: 'fa-pepper-hot' },
    [CuisineType.Chinese]: { label: 'Chinese', icon: 'fa-bowl-rice' },
    [CuisineType.Japanese]: { label: 'Japanese', icon: 'fa-fish-fins' },
    [CuisineType.Indian]: { label: 'Indian', icon: 'fa-bowl-food' },
    [CuisineType.French]: { label: 'French', icon: 'fa-wine-glass' },
    [CuisineType.Mediterranean]: { label: 'Mediterranean', icon: 'fa-lemon' },
    [CuisineType.Asian]: { label: 'Asian', icon: 'fa-shrimp' },
    [CuisineType.British]: { label: 'British', icon: 'fa-mug-hot' },
    [CuisineType.Caribbean]: { label: 'Caribbean', icon: 'fa-umbrella-beach' },
    [CuisineType.CentralEurope]: { label: 'Central Eu', icon: 'fa-bread-slice' },
    [CuisineType.EasternEurope]: { label: 'Eastern Eu', icon: 'fa-wheat-awn' },
    [CuisineType.Kosher]: { label: 'Kosher', icon: 'fa-star-of-david' },
    [CuisineType.MiddleEastern]: { label: 'Middle Eastern', icon: 'fa-kebab' },
    [CuisineType.Nordic]: { label: 'Nordic', icon: 'fa-snowflake' },
    [CuisineType.SouthAmerican]: { label: 'South American', icon: 'fa-drumstick-bite' },
    [CuisineType.SouthEastAsian]: { label: 'SE Asian', icon: 'fa-shrimp' },
    [CuisineType.Polish]: { label: 'Polish', icon: 'fa-stroopwafel' },
    [CuisineType.Korean]: { label: 'Korean', icon: 'fa-fire-burner' },
    [CuisineType.Greek]: { label: 'Greek', icon: 'fa-cheese' },
    [CuisineType.World]: { label: 'World', icon: 'fa-earth-americas' },
};

const popularCuisineKeys: CuisineType[] = [
    CuisineType.Italian,
    CuisineType.Mexican,
    CuisineType.Chinese,
    CuisineType.Japanese,
    CuisineType.Indian,
    CuisineType.French,
    CuisineType.American,
    CuisineType.Mediterranean,
];

const moreCuisineKeys: CuisineType[] = Object.values(CuisineType).filter(
    (cuisine) => !popularCuisineKeys.includes(cuisine)
);

export default function RecipeFilterPopup({ isOpen, onClose, onCook }: RecipeFilterPopupProps) {
    const [mealType, setMealType] = useState<MealType | ''>('');
    const [cuisineType, setCuisineType] = useState<CuisineType | ''>('');
    const [showMoreCuisines, setShowMoreCuisines] = useState(false);
    const [cuisineSearch, setCuisineSearch] = useState('');

    if (!isOpen) return null;

    const handleCook = () => {
        onCook({
            mealType: mealType || undefined,
            cuisineType: cuisineType || undefined,
        });
    };

    const handleSkip = () => {
        onCook({});
    };

    const filteredMoreCuisines = moreCuisineKeys.filter((cuisineKey) =>
        cuisineTypeDisplay[cuisineKey].label.toLowerCase().includes(cuisineSearch.toLowerCase())
    );

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
                
                {/* Header */}
                <div className="bg-linear-to-r from-primary/10 via-safe/10 to-primary/10 p-6 border-b border-gray-200 shrink-0">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                            <i className="fa-solid fa-sliders text-primary"></i>
                            Recipe Filters
                        </h2>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/50 transition-colors text-gray-600"
                        >
                            <i className="fa-solid fa-xmark"></i>
                        </button>
                    </div>
                    <p className="text-sm text-gray-600">Customize your recipe search (optional)</p>
                </div>
                <div className="p-6 overflow-y-auto">
                    
                    {/* Meal Type Section */}
                    <div className="mb-8">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <i className="fa-solid fa-clock text-primary"></i>
                            Meal Type
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                            {Object.values(MealType).map((meal) => (
                                <button
                                    key={meal}
                                    onClick={() => setMealType(meal === mealType ? '' : meal)}
                                    className={`p-4 rounded-xl border-2 transition-all font-semibold flex flex-col items-center gap-2 ${
                                        mealType === meal
                                            ? 'border-primary bg-primary/10 text-primary shadow-lg scale-105'
                                            : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50 text-gray-600'
                                    }`}
                                >
                                    <i className={`fa-solid ${mealTypeDisplay[meal].icon} text-2xl`}></i>
                                    <span className="text-sm">{mealTypeDisplay[meal].label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Cuisine Type Section */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <i className="fa-solid fa-earth-americas text-primary"></i>
                            Cuisine Type
                        </h3>

                        {/* Popular Cuisines */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                            {popularCuisineKeys.map((cuisineKey) => (
                                <button
                                    key={cuisineKey}
                                    onClick={() => setCuisineType(cuisineKey === cuisineType ? '' : cuisineKey)}
                                    className={`p-4 rounded-xl border-2 transition-all font-semibold flex flex-col items-center gap-2 ${
                                        cuisineType === cuisineKey
                                            ? 'border-safe bg-safe/10 text-safe shadow-lg scale-105'
                                            : 'border-gray-200 hover:border-safe/50 hover:bg-gray-50 text-gray-600'
                                    }`}
                                >
                                    <i className={`fa-solid ${cuisineTypeDisplay[cuisineKey].icon} text-3xl`}></i>
                                    <span className="text-sm">{cuisineTypeDisplay[cuisineKey].label}</span>
                                </button>
                            ))}
                        </div>

                        {/* Toggle Button */}
                        {!showMoreCuisines && (
                            <button
                                onClick={() => setShowMoreCuisines(true)}
                                className="w-full py-3 mb-4 rounded-xl border-2 border-dashed border-gray-300 hover:border-primary transition-colors text-gray-600 hover:text-primary font-semibold flex items-center justify-center gap-2"
                            >
                                <i className="fa-solid fa-chevron-down"></i>
                                {moreCuisineKeys.length} More Cuisines
                            </button>
                        )}

                        {/* Expandable More Cuisines */}
                        {showMoreCuisines && (
                            <div className="space-y-4 animate-in slide-in-from-top-2 duration-200">
                                
                                <div className="flex gap-2">
                                     {/* Search Bar */}
                                    <div className="relative flex-1">
                                        <i className="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                                        <input
                                            type="text"
                                            placeholder="Search cuisines..."
                                            value={cuisineSearch}
                                            onChange={(e) => setCuisineSearch(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary bg-bg-secondary"
                                        />
                                    </div>
                                    {/* Collapse Button */}
                                    <button 
                                        onClick={() => setShowMoreCuisines(false)}
                                        className="px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-100 text-gray-600"
                                    >
                                        <i className="fa-solid fa-chevron-up"></i>
                                    </button>
                                </div>

                                {/* More Cuisines Grid */}
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                    {filteredMoreCuisines.map((cuisineKey) => (
                                        <button
                                            key={cuisineKey}
                                            onClick={() => setCuisineType(cuisineKey === cuisineType ? '' : cuisineKey)}
                                            className={`p-3 rounded-lg border transition-all font-medium text-sm flex items-center gap-3 ${
                                                cuisineType === cuisineKey
                                                    ? 'border-safe bg-safe/10 text-safe'
                                                    : 'border-gray-200 hover:border-safe/50 hover:bg-gray-50 text-gray-600'
                                            }`}
                                        >
                                            <i className={`fa-solid ${cuisineTypeDisplay[cuisineKey].icon} text-lg w-6 text-center`}></i>
                                            <span>{cuisineTypeDisplay[cuisineKey].label}</span>
                                        </button>
                                    ))}
                                    {filteredMoreCuisines.length === 0 && (
                                        <div className="col-span-full text-center py-8 text-gray-400">
                                            No cuisines found
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 bg-gray-50 border-t border-gray-200 flex gap-3 shrink-0">
                    <button
                        onClick={handleSkip}
                        className="flex-1 py-3 px-4 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-colors"
                    >
                        Skip Filters
                    </button>
                    <button
                        onClick={handleCook}
                        className="flex-1 py-3 px-4 bg-primary text-white rounded-xl font-bold hover:bg-primary-hover transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                    >
                        Find Recipes
                        <i className="fa-solid fa-arrow-right"></i>
                    </button>
                </div>
            </div>
        </div>
    );
}