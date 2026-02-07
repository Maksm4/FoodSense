import { useState, type TouchEvent } from 'react';
import type { Recipe } from '../../Data/Recipe';

interface RecipeCardProps {
    recipe: Recipe;
    onSwipeLeft: () => void;
    onSwipeRight: () => void;
}

export default function RecipeCard({ recipe, onSwipeLeft, onSwipeRight }: RecipeCardProps) {
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);
    const [isSwiping, setIsSwiping] = useState(false);

    const minSwipeDistance = 50;

    const onTouchStart = (e: TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
        setIsSwiping(true);
    };

    const onTouchMove = (e: TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        setIsSwiping(false);
        if (!touchStart || !touchEnd) return;
        
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe) {
            onSwipeLeft();
        } else if (isRightSwipe) {
            onSwipeRight();
        }
    };

    return (
        <>
            <div 
                className={`
                    md:hidden
                    bg-white rounded-3xl shadow-xl overflow-hidden 
                    border border-gray-100 touch-pan-y select-none
                    transition-transform duration-200
                    ${isSwiping ? 'scale-[1.02]' : 'scale-100'}
                    w-full max-w-sm
                `}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
            >
                {/* Photo with Calories Badge */}
                <div className="relative h-80 bg-gray-100">
                    <img 
                        src={recipe.image} 
                        alt={recipe.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                    />
                    {/* Calories Badge - Top Right */}
                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-gray-100 flex items-center gap-2">
                        <i className="fa-solid fa-fire text-danger text-sm"></i>
                        <span className="text-sm font-bold text-gray-800">
                            {recipe.calories} kcal
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Title */}
                    <h3 className="text-2xl font-bold text-gray-800 leading-tight mb-6">
                        {recipe.title}
                    </h3>

                    {/* Time & Ingredients Row */}
                    <div className="flex items-center gap-3 mb-6">
                        {/* Time */}
                        <div className="flex items-center gap-2 bg-bg-secondary px-4 py-2 rounded-xl border border-gray-200">
                            <i className="fa-solid fa-clock text-primary"></i>
                            <span className="text-sm font-semibold text-gray-700">
                                {recipe.time > 0 ? `${recipe.time} min` : 'N/A'}
                            </span>
                        </div>

                        {/* Ingredients with Hover */}
                        <div className="group relative flex-1">
                            <div className="flex items-center gap-2 bg-bg-secondary px-4 py-2 rounded-xl border border-gray-200 cursor-help hover:bg-selection-bg transition-colors">
                                <i className="fa-solid fa-carrot text-safe"></i>
                                <span className="text-sm font-semibold text-gray-700">
                                    {recipe.ingredients?.length || 0} ingredients
                                </span>
                            </div>

                            {/* Hover Tooltip */}
                            <div className="absolute bottom-full left-0 mb-2 w-72 bg-white p-4 rounded-2xl shadow-2xl border border-gray-200 hidden group-hover:block z-50 max-h-64 overflow-y-auto">
                                <p className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-wide flex items-center gap-2">
                                    <i className="fa-solid fa-list"></i>
                                    Ingredients
                                </p>
                                <ul className="space-y-2">
                                    {recipe.ingredients?.map((ing, idx) => (
                                        <li key={idx} className="text-sm text-gray-700 pb-2 border-b border-gray-100 last:border-0">
                                            <span className="font-bold text-primary">
                                                {ing.quantity > 0 ? `${ing.quantity} ${ing.measure}` : ing.measure}
                                            </span>{' '}
                                            <span>{ing.text}</span>
                                        </li>
                                    ))}
                                </ul>
                                {/* Arrow */}
                                <div className="absolute top-full left-6 -mt-2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-white"></div>
                            </div>
                        </div>
                    </div>

                    {/* Tags (3 tags) */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        {recipe.tags.slice(0, 3).map((tag) => (
                            <span 
                                key={tag} 
                                className="px-4 py-1.5 bg-selection-bg text-primary text-sm font-bold rounded-full border border-primary/20 flex items-center gap-1.5"
                            >
                                <i className="fa-solid fa-tag text-xs"></i>
                                {tag}
                            </span>
                        ))}
                    </div>

                    {/* Link to Recipe */}
                    <a 
                        href={recipe.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-full text-center py-4 bg-primary text-white font-bold rounded-2xl hover:bg-primary-hover transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                        onClick={(e) => e.stopPropagation()}
                    >
                        View Full Recipe
                        <i className="fa-solid fa-arrow-up-right-from-square"></i>
                    </a>
                </div>
            </div>

            <div className="hidden md:flex bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200 w-full max-w-6xl h-150">
                {/* LEFT: Ingredients List - 2 parts */}
                <div className="flex-2 bg-linear-to-b from-bg-secondary to-white p-6 overflow-y-auto border-r border-gray-200">
                    <div className="sticky top-0 bg-linear-to-b from-bg-secondary to-transparent pb-3 mb-4">
                        <h4 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            <i className="fa-solid fa-bowl-food text-primary text-2xl"></i>
                            Ingredients
                        </h4>
                    </div>
                    
                    <ul className="space-y-3">
                        {recipe.ingredients?.map((ing, idx) => (
                            <li key={idx} className="text-sm pb-3 border-b border-gray-200 last:border-0">
                                <div className="flex items-start gap-2">
                                    <i className="fa-solid fa-circle-check text-primary text-xs mt-1 shrink-0"></i>
                                    <div className="flex-1">
                                        <span className="text-primary font-bold">
                                            {ing.quantity > 0 ? `${ing.quantity} ${ing.measure}` : ing.measure || ''}
                                        </span>{' '}
                                        <span className="text-gray-700">{ing.text}</span>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* MIDDLE: Photo - 3 parts (wider!) */}
                <div className="flex-3 relative bg-gray-100 shrink-0">
                    <img 
                        src={recipe.image} 
                        alt={recipe.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                    />
                </div>

                {/* RIGHT: Recipe Info - 2 parts */}
                <div className="flex-2 p-8 flex flex-col bg-linear-to-b from-white to-bg-secondary">
                    {/* Title & Author */}
                    <div className="mb-6">
                        <h3 className="text-3xl font-bold text-gray-800 leading-tight mb-2">
                            {recipe.title}
                        </h3>
                        <p className="text-sm text-gray-500 font-medium flex items-center gap-2">
                            <i className="fa-solid fa-user-chef"></i>
                            {recipe.author}
                        </p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                        {/* Time */}
                        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                            <div className="text-xs text-gray-500 mb-1 font-semibold uppercase flex items-center gap-1">
                                <i className="fa-solid fa-clock"></i>
                                Time
                            </div>
                            <div className="font-bold text-gray-800 text-lg">
                                {recipe.time > 0 ? `${recipe.time} min` : 'N/A'}
                            </div>
                        </div>

                        {/* Calories */}
                        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                            <div className="text-xs text-gray-500 mb-1 font-semibold uppercase flex items-center gap-1">
                                <i className="fa-solid fa-fire"></i>
                                Calories
                            </div>
                            <div className="font-bold text-primary text-lg">{recipe.calories}</div>
                        </div>

                        {/* Meal Type */}
                        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                            <div className="text-xs text-gray-500 mb-1 font-semibold uppercase flex items-center gap-1">
                                <i className="fa-solid fa-utensils"></i>
                                Meal
                            </div>
                            <div className="font-bold text-gray-800 capitalize text-sm">
                                {recipe.mealType || 'Any'}
                            </div>
                        </div>

                        {/* Cuisine */}
                        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                            <div className="text-xs text-gray-500 mb-1 font-semibold uppercase flex items-center gap-1">
                                <i className="fa-solid fa-earth-americas"></i>
                                Cuisine
                            </div>
                            <div className="font-bold text-gray-800 capitalize text-sm">
                                {recipe.cuisineType || 'World'}
                            </div>
                        </div>
                    </div>

                    {/* Tags (5 tags) */}
                    <div className="mb-6">
                        <div className="text-xs text-gray-500 mb-3 font-semibold uppercase tracking-wide flex items-center gap-2">
                            <i className="fa-solid fa-tags"></i>
                            Tags
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {recipe.tags.slice(0, 5).map((tag) => (
                                <span 
                                    key={tag} 
                                    className="px-3 py-1.5 bg-selection-bg text-primary text-xs font-bold rounded-full border border-primary/20"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Link Button */}
                    <a 
                        href={recipe.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="mt-auto w-full text-center py-4 bg-primary text-white font-bold rounded-2xl hover:bg-primary-hover transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                        onClick={(e) => e.stopPropagation()}
                    >
                        View Full Recipe
                        <i className="fa-solid fa-arrow-up-right-from-square"></i>
                    </a>
                </div>
            </div>
        </>
    );
}