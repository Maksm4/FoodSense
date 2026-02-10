import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import type { Recipe } from "../../Data/Recipe";

export default function SessionLikesPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const kitchenId = (location.state?.kitchenId as string) || "";
    const ingredients = location.state?.ingredients || [];
    const filters = location.state?.filters || {};

    // Load from localStorage
    const [sessionLikes, setSessionLikes] = useState<Recipe[]>(() => {
        const saved = localStorage.getItem('sessionLikes');
        return saved ? JSON.parse(saved) : [];
    });

    // Update localStorage when sessionLikes changes
    useEffect(() => {
        localStorage.setItem('sessionLikes', JSON.stringify(sessionLikes));
    }, [sessionLikes]);

    const handleRemove = (recipeUrl: string) => {
        setSessionLikes(prev => prev.filter(r => r.url !== recipeUrl));
    };

    const handleSaveToFavorites = async (recipe: Recipe) => {
        // TODO: Implement save to backend
        console.log('Saving to favorites:', recipe);
        alert(`"${recipe.title}" will be saved to favorites!`);
        // await recipeService.saveToFavorites(recipe);
    };

    const handleSaveAll = async () => {
        // TODO: Bulk save to backend
        console.log('Saving all to favorites:', sessionLikes);
        alert(`${sessionLikes.length} recipes will be saved to favorites!`);
        
        // Clear session likes after saving
        localStorage.removeItem('sessionLikes');
        navigate(`/kitchens/${kitchenId}`);
    };

    const handleContinueBrowsing = () => {
        navigate('/recipes', {
            state: { 
                ingredients,
                kitchenId,
                filters
            }
        });
    };

    const handleClearAll = () => {
        if (confirm('Are you sure you want to clear all session likes?')) {
            setSessionLikes([]);
            localStorage.removeItem('sessionLikes');
        }
    };

    if (sessionLikes.length === 0) {
        return (
            <div className="min-h-screen bg-bg-secondary flex items-center justify-center p-6">
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 w-full max-w-md text-center">
                    <i className="fa-solid fa-heart-crack text-6xl text-gray-300 mb-4"></i>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">No Recipes Liked Yet</h2>
                    <p className="text-gray-500 mb-6">Start swiping to find recipes you love!</p>
                    <button
                        onClick={handleContinueBrowsing}
                        className="w-full px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-hover transition-all shadow-lg shadow-primary/20"
                    >
                        Browse Recipes
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-bg-secondary">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
                                <i className="fa-solid fa-heart text-primary"></i>
                                Session Picks
                            </h1>
                            <p className="text-sm text-gray-500 mt-1">
                                {sessionLikes.length} recipe{sessionLikes.length !== 1 ? 's' : ''} you liked
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={handleContinueBrowsing}
                                className="px-4 py-2 bg-white border-2 border-primary text-primary rounded-xl font-semibold hover:bg-primary/5 transition-all flex items-center gap-2"
                            >
                                <i className="fa-solid fa-arrow-left"></i>
                                <span className="hidden md:inline">Continue Browsing</span>
                            </button>
                            
                            <button
                                onClick={handleClearAll}
                                className="px-4 py-2 bg-white border-2 border-danger text-danger rounded-xl font-semibold hover:bg-danger/5 transition-all flex items-center gap-2"
                            >
                                <i className="fa-solid fa-trash"></i>
                                <span className="hidden md:inline">Clear All</span>
                            </button>

                            <button
                                onClick={handleSaveAll}
                                className="px-4 py-2 bg-primary text-white rounded-xl font-semibold hover:bg-primary-hover transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
                            >
                                <i className="fa-solid fa-bookmark"></i>
                                Save All to Favorites
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recipe Grid */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sessionLikes.map((recipe) => (
                        <div
                            key={recipe.url}
                            className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-200 hover:shadow-xl transition-all group"
                        >
                            {/* Image */}
                            <div className="relative h-48 bg-gray-100 overflow-hidden">
                                <img
                                    src={recipe.image}
                                    alt={recipe.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                {/* Calories Badge */}
                                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
                                    <span className="text-xs font-bold text-primary flex items-center gap-1">
                                        <i className="fa-solid fa-fire text-danger"></i>
                                        {recipe.calories}
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-4">
                                <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
                                    {recipe.title}
                                </h3>

                                <p className="text-sm text-gray-500 mb-3">
                                    by {recipe.author}
                                </p>

                                {/* Meta */}
                                <div className="flex items-center gap-3 mb-4 text-sm text-gray-500">
                                    <span className="flex items-center gap-1">
                                        <i className="fa-solid fa-clock"></i>
                                        {recipe.time > 0 ? `${recipe.time}m` : 'N/A'}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <i className="fa-solid fa-carrot"></i>
                                        {recipe.ingredients?.length || 0}
                                    </span>
                                </div>

                                {/* Tags */}
                                <div className="flex flex-wrap gap-1 mb-4">
                                    {recipe.tags.slice(0, 3).map((tag) => (
                                        <span
                                            key={tag}
                                            className="px-2 py-1 bg-selection-bg text-primary text-xs font-semibold rounded-full"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                    {recipe.tags.length > 3 && (
                                        <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs font-semibold rounded-full">
                                            +{recipe.tags.length - 3}
                                        </span>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2">
                                    <a
                                        href={recipe.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 py-2 px-3 bg-bg-secondary text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-200 transition-colors text-center"
                                        >
                                        <i className="fa-solid fa-arrow-up-right-from-square mr-1"></i>
                                        View Recipe
                                    </a>
                                    <button
                                        onClick={() => handleSaveToFavorites(recipe)}
                                        className="px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-all"
                                        title="Save to Favorites"
                                    >
                                        <i className="fa-solid fa-bookmark"></i>
                                    </button>
                                    <button
                                        onClick={() => handleRemove(recipe.url)}
                                        className="px-3 py-2 bg-danger/10 text-danger rounded-lg hover:bg-danger/20 transition-all"
                                        title="Remove"
                                    >
                                        <i className="fa-solid fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}