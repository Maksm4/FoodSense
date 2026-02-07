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

    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [nextPageToken, setNextPageToken] = useState<string | null>(null);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const lastFetchedToken = useRef<string | null>(null);

    const getSearchTerms = () => {
        const categories = ingredients
            .map(i => i.mainCategory)
            .filter(c => c && c.trim() !== "")
            .map(c => c.replace(/^en:/, '')); 
        
        return [...new Set(categories)];
    };

    useEffect(() => {
        async function fetchData() {
            const searchTerms = getSearchTerms();

            if (searchTerms.length === 0) {
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                const response = await recipeService.searchRecipes({
                    ingredients: searchTerms
                });

                setRecipes(response.items || []);
                setNextPageToken(response.nextPageToken || null);
                setIsLoading(false);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch recipes');
                setIsLoading(false);
            }
        } 
        fetchData();
    }, []); 

    const loadMoreRecipes = async () => {
        if (!nextPageToken || isLoadingMore) return;
        if (lastFetchedToken.current === nextPageToken) return;

        try {
            console.log("Fetching more recipes...");
            setIsLoadingMore(true);
            lastFetchedToken.current = nextPageToken;

            const searchTerms = getSearchTerms();

            const response = await recipeService.searchRecipes({
                ingredients: searchTerms,
                nextPageToken: nextPageToken
            });

            setRecipes(prev => [...prev, ...response.items]);
            setNextPageToken(response.nextPageToken || null);
            setIsLoadingMore(false);
        } catch (error) {
            console.error("Background fetch failed", error);
            setIsLoadingMore(false);
            lastFetchedToken.current = null;
        }
    };

    const checkAndLoadMore = (newIndex: number) => {
        const thresholdIndex = Math.floor(recipes.length * 0.7);
        if (newIndex === thresholdIndex && nextPageToken && !isLoadingMore) {
            loadMoreRecipes();
        }
    };

    const handleSwipeLeft = () => {
        const nextIndex = currentIndex + 1;
        setCurrentIndex(nextIndex);
        checkAndLoadMore(nextIndex);
    };

    const handleSwipeRight = () => {
        const nextIndex = currentIndex + 1;
        setCurrentIndex(nextIndex);
        checkAndLoadMore(nextIndex);
    };

    const handleRestart = () => {
        setCurrentIndex(0);
        lastFetchedToken.current = null;
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
                        onClick={() => navigate('/')}
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
                        onClick={() => navigate('/')}
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
                            <button 
                                onClick={handleRestart}
                                className="w-full py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-hover transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                            >
                                <i className="fa-solid fa-rotate-right"></i>
                                Start Over
                            </button>

                            <button 
                                onClick={() => navigate('/')}
                                className="w-full py-3 bg-white border-2 border-primary text-primary rounded-xl font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
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
            <div className="md:hidden p-4 flex items-center justify-between sticky top-0 z-10">
                <button 
                    onClick={() => navigate('/')}
                    className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-sm text-gray-600 hover:text-primary transition-colors"
                >
                    <i className="fa-solid fa-xmark text-xl"></i>
                </button>
                
                <div className="px-4 py-2 bg-white/90 backdrop-blur rounded-full shadow-sm border border-gray-100 max-w-[60%]">
                    <p className="text-xs text-gray-500 font-medium truncate text-center">
                        {ingredients.map(i => i.name).join(', ')}
                    </p>
                </div>

                <div className="w-10" />
            </div>

            {/* DESKTOP HEADER */}
            <div className="hidden md:flex items-center justify-between px-8 py-6 bg-white border-b border-gray-200">
                {/* Left: Back Arrow */}
                <button 
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all"
                >
                    <i className="fa-solid fa-arrow-left text-xl"></i>
                    <span>Back</span>
                </button>

                {/* Center: Ingredients List */}
                <div className="flex-1 flex justify-center px-8">
                    <div className="bg-linear-to-r from-primary/10 via-safe/10 to-primary/10 px-8 py-3 rounded-full border-2 border-primary/20 shadow-sm max-w-3xl">
                        <p className="text-sm font-semibold text-gray-700 text-center flex items-center justify-center gap-2">
                            <i className="fa-solid fa-bowl-food text-primary"></i>
                            {ingredients.map(i => i.name).join(' • ')}
                        </p>
                    </div>
                </div>

                {/* Right: Spacer for balance */}
                <div className="w-24"></div>
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