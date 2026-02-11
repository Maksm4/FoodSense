import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import type { Ingredient } from "../../Data/Ingredient";
import type { Recipe } from "../../Data/Recipe";
import { recipeService } from "../../api/recipeService";
import RecipeCard from "../Recipe/RecipeCard";

export default function RecipePage() {
    const location = useLocation();
    const navigate = useNavigate();
    const ingredients = (location.state?.ingredients as Ingredient[]) || [];
    const kitchenId = (location.state?.kitchenId as string) || "";
    const filters = location.state?.filters || {};

    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Session likes from localStorage
    const [sessionLikes, setSessionLikes] = useState<Recipe[]>(() => {
        const saved = localStorage.getItem('sessionLikes');
        return saved ? JSON.parse(saved) : [];
    });

    const shownRecipeIds = useRef<Set<string>>(new Set());
    const isFetchingRef = useRef(false);

    const preloadedImages = useRef<Set<string>>(new Set());
    const preloadBatchSize = 10;

    // Save to localStorage whenever sessionLikes changes
    useEffect(() => {
        localStorage.setItem('sessionLikes', JSON.stringify(sessionLikes));
    }, [sessionLikes]);

    const getSearchTerms = () => {
        const categories = ingredients
            .map(i => i.mainCategory)
            .filter(c => c && c.trim() !== "")
            .map(c => c.replace(/^en:/, '')); 
        
        return [...new Set(categories)];
    };

    // Preload images function
    const preloadImages = (startIndex: number, count: number) => {
        const endIndex = Math.min(startIndex + count, recipes.length);
        
        for (let i = startIndex; i < endIndex; i++) {
            const recipe = recipes[i];
            if (recipe?.image && !preloadedImages.current.has(recipe.image)) {
                const img = new Image();
                img.src = recipe.image;
                preloadedImages.current.add(recipe.image);
            }
        }
    };

    const fetchRandomRecipes = async () => {
        if (isFetchingRef.current) return;
        
        try {
            isFetchingRef.current = true;
            const searchTerms = getSearchTerms();

            if (searchTerms.length === 0) {
                setIsLoading(false);
                return;
            }

            const response = await recipeService.searchRecipes({
                ingredients: searchTerms,
                mealType: filters.mealType,
                cuisineType: filters.cuisineType,
            });

            // Filter out recipes already shown
            const newRecipes = (response.items || []).filter(
                recipe => !shownRecipeIds.current.has(recipe.id)
            );

            newRecipes.forEach(recipe => {
                shownRecipeIds.current.add(recipe.id);
            });

            return newRecipes;
        } finally {
            isFetchingRef.current = false;
        }
    };

    // Initial load
    useEffect(() => {
        async function fetchData() {
            try {
                setIsLoading(true);
                const newRecipes = await fetchRandomRecipes();
                if (newRecipes) {
                    setRecipes(newRecipes);
                    setIsLoading(false);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch recipes');
                setIsLoading(false);
            }
        } 
        fetchData();
    }, []); 

    // Preload first batch of images when recipes are loaded
    useEffect(() => {
        if (recipes.length > 0 && preloadedImages.current.size === 0) {
            preloadImages(0, preloadBatchSize);
        }
    }, [recipes]);

    useEffect(() => {
        // When user reaches index that's 5 away from last preloaded batch
        const nextPreloadIndex = Math.floor(currentIndex / preloadBatchSize) * preloadBatchSize + preloadBatchSize;
        
        if (currentIndex >= nextPreloadIndex - 5 && nextPreloadIndex < recipes.length) {
            preloadImages(nextPreloadIndex, preloadBatchSize);
        }
    }, [currentIndex, recipes]);

    const loadMoreRecipes = async () => {
        if (isLoading) return;

        try {
            setIsLoading(true);
            const newRecipes = await fetchRandomRecipes();

            if (newRecipes && newRecipes.length > 0) {
                setRecipes(prev => {
                    const updated = [...prev, ...newRecipes];
                    
                    const startPreloadIndex = prev.length;
                    setTimeout(() => {
                        preloadImages(startPreloadIndex, preloadBatchSize);
                    }, 100);
                    
                    return updated;
                });
            }
            
            setIsLoading(false);
        } catch (error) {
            console.error("Failed to load more recipes", error);
            setIsLoading(false);
        }
    };

    const checkAndLoadMore = (newIndex: number) => {
        if (newIndex >= recipes.length - 5) {
            loadMoreRecipes();
        }
    };

    const handleSwipeLeft = () => {
        const nextIndex = currentIndex + 1;
        setCurrentIndex(nextIndex);
        checkAndLoadMore(nextIndex);
    };

    const handleSwipeRight = () => {
        // Add to session likes
        const currentRecipe = recipes[currentIndex];
        if (currentRecipe && !sessionLikes.some(r => r.id === currentRecipe.id)) {
            setSessionLikes(prev => [...prev, currentRecipe]);
        }

        const nextIndex = currentIndex + 1;
        setCurrentIndex(nextIndex);
        checkAndLoadMore(nextIndex);
    };

    const handleViewSessionLikes = () => {
        navigate('/recipes/session-likes', {
            state: { 
                kitchenId,
                ingredients,
                filters
            }
        });
    };

    const handleRestart = () => {
        setCurrentIndex(0);
        shownRecipeIds.current.clear();
        preloadedImages.current.clear();
        
        // Preload first batch again
        setTimeout(() => {
            preloadImages(0, preloadBatchSize);
        }, 100);
    };

    if (isLoading) {
        return (
            <div className="h-screen flex items-center justify-center bg-bg-secondary">
                <div className="text-center animate-pulse">
                    <i className="fa-solid fa-utensils text-5xl mb-4 text-primary"></i>
                    <p className="text-gray-500 font-medium">Finding delicious recipes...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-screen flex items-center justify-center bg-bg-secondary p-6">
                <div className="text-center bg-white p-8 rounded-3xl shadow-xl border border-gray-100 max-w-sm w-full">
                    <i className="fa-solid fa-face-frown text-5xl mb-4 text-danger"></i>
                    <p className="text-danger mb-6 font-semibold">{error}</p>
                    <button 
                        onClick={() => navigate(`/kitchens/${kitchenId}`)}
                        className="w-full py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-hover transition-colors shadow-lg shadow-primary/20"
                    >
                        Back to Kitchen
                    </button>
                </div>
            </div>
        );
    }

    if (recipes.length === 0) {
        return (
            <div className="h-screen flex items-center justify-center bg-bg-secondary p-6">
                <div className="text-center bg-white p-8 rounded-3xl shadow-xl border border-gray-100 max-w-sm w-full">
                    <i className="fa-solid fa-bowl-food text-5xl mb-4 text-gray-400"></i>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">No Recipes Found</h2>
                    <p className="text-gray-500 mb-6">
                        We couldn't find any recipes matching your ingredients.
                    </p>
                    <button 
                        onClick={() => navigate(`/kitchens/${kitchenId}`)}
                        className="w-full py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-hover transition-colors shadow-lg shadow-primary/20"
                    >
                        Back to Kitchen
                    </button>
                </div>
            </div>
        );
    }

    if (currentIndex >= recipes.length) {
        return (
            <div className="min-h-screen flex flex-col bg-bg-secondary">
                <div className="p-4 bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-gray-100">
                    <button 
                        onClick={() => navigate(`/kitchens/${kitchenId}`)}
                        className="text-primary font-bold flex items-center gap-2"
                    >
                        <i className="fa-solid fa-arrow-left"></i>
                        Back to Kitchen
                    </button>
                </div>

                <div className="flex-1 flex items-center justify-center p-6">
                    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 w-full max-w-sm text-center">
                        <i className="fa-solid fa-champagne-glasses text-6xl mb-4 text-primary"></i>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">That's all for now!</h2>
                        <p className="text-gray-500 mb-8">
                            We've gone through all the recipes matching your ingredients.
                        </p>

                        <div className="space-y-3">
                            {sessionLikes.length > 0 && (
                                <button 
                                    onClick={handleViewSessionLikes}
                                    className="w-full py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-hover transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                                >
                                    <i className="fa-solid fa-heart"></i>
                                    View {sessionLikes.length} Liked Recipe{sessionLikes.length !== 1 ? 's' : ''}
                                </button>
                            )}

                            <button 
                                onClick={handleRestart}
                                className="w-full py-3 bg-white border-2 border-primary text-primary rounded-xl font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                            >
                                <i className="fa-solid fa-rotate-right"></i>
                                Start Over
                            </button>

                            <button 
                                onClick={() => navigate(`/kitchens/${kitchenId}`)}
                                className="w-full py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                            >
                                <i className="fa-solid fa-house"></i>
                                Go to Kitchen
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-bg-secondary">
            {/* MOBILE HEADER */}
            <div className="md:hidden p-4 flex items-center justify-between sticky top-0 z-10 bg-bg-secondary">
                <button 
                    onClick={() => navigate(`/kitchens/${kitchenId}`)}
                    className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-sm text-gray-600 hover:text-primary transition-colors"
                >
                    <i className="fa-solid fa-xmark text-xl"></i>
                </button>
                
                <div className="px-4 py-2 bg-white/90 backdrop-blur rounded-full shadow-sm border border-gray-100 max-w-[60%]">
                    <p className="text-xs text-gray-500 font-medium truncate text-center">
                        {ingredients.map(i => i.name).join(', ')}
                    </p>
                </div>

                {/* Session Likes Badge - Mobile */}
                {sessionLikes.length > 0 ? (
                    <button
                        onClick={handleViewSessionLikes}
                        className="relative w-10 h-10 flex items-center justify-center bg-primary rounded-full shadow-lg text-white"
                    >
                        <i className="fa-solid fa-heart"></i>
                        <span className="absolute -top-1 -right-1 bg-danger text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                            {sessionLikes.length}
                        </span>
                    </button>
                ) : (
                    <div className="w-10" />
                )}
            </div>

            {/* DESKTOP HEADER */}
            <div className="hidden md:flex items-center justify-between px-8 py-6 bg-white border-b border-gray-200">
                <button 
                    onClick={() => navigate(`/kitchens/${kitchenId}`)}
                    className="flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all"
                >
                    <i className="fa-solid fa-arrow-left text-xl"></i>
                    <span>Back</span>
                </button>

                <div className="flex-1 flex justify-center px-8">
                    <div className="bg-linear-to-r from-primary/10 via-safe/10 to-primary/10 px-8 py-3 rounded-full border-2 border-primary/20 shadow-sm max-w-3xl">
                        <p className="text-sm font-semibold text-gray-700 text-center flex items-center justify-center gap-2">
                            <i className="fa-solid fa-bowl-food text-primary"></i>
                            {ingredients.map(i => i.name).join(' • ')}
                        </p>
                    </div>
                </div>

                {/* Session Likes Button - Desktop */}
                {sessionLikes.length > 0 ? (
                    <button
                        onClick={handleViewSessionLikes}
                        className="relative flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-full shadow-lg hover:bg-primary-hover transition-all"
                    >
                        <i className="fa-solid fa-heart"></i>
                        <span className="font-semibold">{sessionLikes.length} Liked</span>
                    </button>
                ) : (
                    <div className="w-24"></div>
                )}
            </div>

            {/* CARD AREA */}
            <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8">
                <RecipeCard 
                    recipe={recipes[currentIndex]}
                    onSwipeLeft={handleSwipeLeft}
                    onSwipeRight={handleSwipeRight}
                />
            </div>

            {/* ACTION BUTTONS */}
            <div className="pb-8 pt-2 flex items-center justify-center gap-6">
                <button
                    onClick={handleSwipeLeft}
                    className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center bg-white border-2 text-danger rounded-full text-3xl md:text-4xl shadow-lg hover:bg-danger/10 hover:scale-105 active:scale-95 transition-all"
                    aria-label="Skip"
                >
                    <i className="fa-solid fa-xmark"></i>
                </button>
                
                <button
                    onClick={handleSwipeRight}
                    className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center bg-white text-primary rounded-full text-3xl md:text-4xl border-2 shadow-xl shadow-primary/30 hover:bg-primary/10 hover:scale-105 active:scale-95 transition-all"
                    aria-label="Save"
                >
                    <i className="fa-solid fa-heart"></i>
                </button>
            </div>
        </div>
    );
}