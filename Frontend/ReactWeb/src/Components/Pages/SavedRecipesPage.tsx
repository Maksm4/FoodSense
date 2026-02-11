import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { SavedRecipe } from "../../Data/Recipe";
import { recipeService } from "../../api/recipeService";

export default function SavedRecipesPage() {
    const navigate = useNavigate();
    const [savedRecipes, setSavedRecipes] = useState<SavedRecipe[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadSavedRecipes();
    }, []);

    const loadSavedRecipes = async () => {
        try {
            setIsLoading(true);
            const recipes = await recipeService.getSavedRecipes();
            setSavedRecipes(recipes);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load saved recipes');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemove = async (externalId: string) => {
        try {
            await recipeService.deleteSavedRecipe(externalId);
            setSavedRecipes(prev => prev.filter(r => r.id !== externalId));
        } catch {
            alert('Failed to remove recipe');
        }
    };

    const formatSavedDate = (date?: Date) => {
        if (!date) return 'Recently saved';
        
        const saved = new Date(date);
        const now = new Date();
        const diffInMs = now.getTime() - saved.getTime();
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

        if (diffInDays === 0) return 'Today';
        if (diffInDays === 1) return 'Yesterday';
        if (diffInDays < 7) return `${diffInDays} days ago`;
        if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
        
        return saved.toLocaleDateString('pl-PL', { 
            month: 'short', 
            day: 'numeric', 
            year: saved.getFullYear() !== now.getFullYear() ? 'numeric' : undefined 
        });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-bg-secondary flex items-center justify-center">
                <div className="text-center animate-pulse">
                    <i className="fa-solid fa-bookmark text-5xl mb-4 text-primary"></i>
                    <p className="text-gray-500 font-medium">Loading your saved recipes...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-bg-secondary flex items-center justify-center p-6">
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 w-full max-w-md text-center">
                    <i className="fa-solid fa-face-frown text-5xl mb-4 text-danger"></i>
                    <p className="text-danger mb-6 font-semibold">{error}</p>
                    <button
                        onClick={() => navigate('/kitchens')}
                        className="w-full py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-hover transition-all"
                    >
                        Back to Kitchen
                    </button>
                </div>
            </div>
        );
    }

    if (savedRecipes.length === 0) {
        return (
            <div className="min-h-screen bg-bg-secondary">
                {/* Header */}
                <div className="bg-white border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate(-1)}
                                className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                <i className="fa-solid fa-arrow-left"></i>
                            </button>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
                                <i className="fa-solid fa-bookmark text-primary"></i>
                                Saved Recipes
                            </h1>
                        </div>
                    </div>
                </div>

                {/* Empty State */}
                <div className="flex items-center justify-center p-6 min-h-[60vh]">
                    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 w-full max-w-md text-center">
                        <i className="fa-solid fa-bookmark text-6xl text-gray-300 mb-4"></i>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">No Saved Recipes Yet</h2>
                        <p className="text-gray-500 mb-6">
                            Start browsing recipes and save your favorites!
                        </p>
                        <button
                            onClick={() => navigate('/kitchens')}
                            className="w-full px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-hover transition-all shadow-lg shadow-primary/20"
                        >
                            Browse Recipes
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-bg-secondary">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate(-1)}
                                className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                <i className="fa-solid fa-arrow-left"></i>
                            </button>
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
                                    <i className="fa-solid fa-bookmark text-primary"></i>
                                    Saved Recipes
                                </h1>
                                <p className="text-sm text-gray-500 mt-1 pl-1">
                                    {savedRecipes.length} recipe{savedRecipes.length !== 1 ? 's' : ''} saved
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recipe Grid/List */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
                {/* Desktop: Grid View */}
            <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedRecipes.map((recipe) => (
                    <div
                        key={recipe.id}
                        className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-200 hover:shadow-xl transition-all group flex flex-col h-full"
                    >
                        {/* Image */}
                        <div className="relative h-48 bg-gray-100 overflow-hidden shrink-0">
                            <img
                                src={recipe.image}
                                alt={recipe.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                        </div>

                        {/* Content */}
                        <div className="p-4 flex flex-col flex-1">
                            <h3 className="text-lg font-bold text-gray-800 mb-1 line-clamp-2">
                                {recipe.title}
                            </h3>

                            <p className="text-sm text-gray-500 mb-3">
                                by {recipe.author}
                            </p>

                            {/* Saved Date */}
                            <div className="flex items-center gap-2 mb-4 text-xs text-gray-400">
                                <i className="fa-solid fa-clock"></i>
                                <span>{formatSavedDate(recipe.savedAt)}</span>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 mt-auto">
                                <a
                                    href={recipe.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 py-2 px-3 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-hover transition-colors text-center"
                                >
                                    <i className="fa-solid fa-arrow-up-right-from-square mr-1"></i>
                                    View Recipe
                                </a>
                                <button
                                    onClick={() => handleRemove(recipe.id)}
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
                {/* Mobile: List View */}
                <div className="md:hidden space-y-4">
                    {savedRecipes.map((recipe) => (
                        <div
                            key={recipe.id}
                            className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-200 flex gap-4 p-4"
                        >
                            {/* Image */}
                            <div className="w-24 h-24 shrink-0 bg-gray-100 rounded-xl overflow-hidden">
                                <img
                                    src={recipe.image}
                                    alt={recipe.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Content */}
                            <div className="flex-1 flex flex-col">
                                <h3 className="text-base font-bold text-gray-800 mb-1 line-clamp-2">
                                    {recipe.title}
                                </h3>

                                <p className="text-sm text-gray-500 mb-2">
                                    by {recipe.author}
                                </p>

                                {/* Saved Date */}
                                <div className="flex items-center gap-2 mb-3 text-xs text-gray-400">
                                    <i className="fa-solid fa-clock"></i>
                                    <span>{formatSavedDate(recipe.savedAt)}</span>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2 mt-auto">
                                    <a
                                        href={recipe.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 py-2 px-3 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-hover transition-colors text-center"
                                    >
                                        <i className="fa-solid fa-arrow-up-right-from-square"></i>
                                    </a>
                                    <button
                                        onClick={() => handleRemove(recipe.id)}
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