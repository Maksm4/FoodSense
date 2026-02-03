import { useLocation, useNavigate } from "react-router-dom";
import type { Ingredient } from "../../Data/Ingredient";
import { useEffect, useState } from "react";
import type { Recipe } from "../../Data/Recipe";
import { recipeService } from "../../api/recipeService";

export default function RecipePage() {
    const location = useLocation();
    const navigation = useNavigate();
    const ingredients = location.state?.ingredients as Ingredient[] || [];

    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchRecipes();
    }, []);

    const fetchRecipes = async () => {
        try {
            setIsLoading(true);

            const ingredientNames = ingredients.map(i => i.name);
            const response = await recipeService.searchRecipes({
                ingredients: ingredientNames,
            });

            setRecipes(response.recipes);
            setIsLoading(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch recipes');
            setIsLoading(false);
        }
    };

    const handleSwipeLeft = () => {
        if (currentIndex < recipes.length - 1) {
            setCurrentIndex(prev => prev + 1);
        }
    };

    const handleSwipeRight = async () => {
        const currentRecipe = recipes[currentIndex];
        if (currentIndex < recipes.length - 1) {
            setCurrentIndex(prev => prev + 1);
        }
    };

    const handleRecipeClick = (recipe: Recipe) => {
        window.open(recipe.sourceUrl, '_blank');
    };

    if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-bg-secondary">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-bounce">🍳</div>
          <p className="text-gray-600">Finding delicious recipes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-bg-secondary">
        <div className="text-center p-6">
          <div className="text-6xl mb-4">😞</div>
          <p className="text-danger mb-4 font-semibold">{error}</p>
          <button 
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-hover"
          >
            Back to Kitchen
          </button>
        </div>
      </div>
    );
  }

  if (recipes.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center bg-bg-secondary">
        <div className="text-center p-6">
          <div className="text-6xl mb-4">🤷</div>
          <p className="text-xl font-semibold mb-2">No recipes found</p>
          <p className="text-gray-500 mb-4">Try different ingredients or filters</p>
          <button 
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-hover"
          >
            Back to Kitchen
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-bg-secondary">
      {/* Header */}
      <div className="p-4 bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-2">
          <button 
            onClick={() => navigate('/')}
            className="text-primary font-semibold"
          >
            ← Back
          </button>
          
          {/* View Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('swipe')}
              className={`px-3 py-1 rounded-lg text-sm font-semibold ${
                viewMode === 'swipe'
                  ? 'bg-primary text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              Swipe
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 rounded-lg text-sm font-semibold ${
                viewMode === 'grid'
                  ? 'bg-primary text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              Grid
            </button>
          </div>
        </div>
        
        <p className="text-sm text-gray-500">
          Using: {ingredients.map(i => i.name).join(', ')}
        </p>
        
        {viewMode === 'swipe' && (
          <p className="text-xs text-gray-400 mt-1">
            Recipe {currentIndex + 1} of {recipes.length}
            {nextPageToken && ' (more available)'}
          </p>
        )}
      </div>

      {/* Content */}
      {viewMode === 'swipe' ? (
        <>
          {/* Swipe View */}
          <div className="flex-1 flex items-center justify-center p-4">
            <RecipeCard 
              recipe={recipes[currentIndex]}
              onSwipeLeft={handleSwipeLeft}
              onSwipeRight={handleSwipeRight}
            />
          </div>

          {/* Loading more indicator */}
          {isLoadingMore && (
            <div className="text-center pb-2">
              <p className="text-sm text-gray-500">Loading more recipes...</p>
            </div>
          )}

          {/* Swipe Buttons */}
          <div className="p-4 flex gap-4 justify-center">
            <button
              onClick={handleSwipeLeft}
              className="w-16 h-16 bg-danger text-white rounded-full text-2xl font-bold shadow-lg hover:bg-[#D06A4F] active:scale-95 transition-transform"
            >
              ✕
            </button>
            <button
              onClick={handleSwipeRight}
              className="w-16 h-16 bg-primary text-white rounded-full text-2xl font-bold shadow-lg hover:bg-primary-hover active:scale-95 transition-transform"
            >
              ♥
            </button>
          </div>
        </>
      ) : (
        <>
          {/* Grid View */}
          <div className="flex-1 overflow-y-auto pb-4">
            <RecipeList 
              recipes={recipes}
              onRecipeClick={handleRecipeClick}
            />
            
            {/* Load More Button */}
            {nextPageToken && (
              <div className="flex justify-center p-4">
                <button
                  onClick={loadMoreRecipes}
                  disabled={isLoadingMore}
                  className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoadingMore ? 'Loading...' : 'Load More Recipes'}
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}