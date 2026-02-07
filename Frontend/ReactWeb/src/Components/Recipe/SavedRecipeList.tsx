import type { Recipe } from '../../Data/Recipe';

interface RecipeListProps {
    recipes: Recipe[];
    onRecipeClick: (recipe: Recipe) => void;
}

export default function RecipeList({ recipes, onRecipeClick }: RecipeListProps) {
    if (recipes.length === 0) {
        return (
            <div className="text-center py-10 text-gray-400">
                No recipes found.
            </div>
        );
    }

    return (
        <div className="p-4 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {recipes.map((recipe, index) => (
                <div 
                    key={`${recipe.id}-${index}`}
                    onClick={() => onRecipeClick(recipe)}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-md hover:border-primary/30 transition-all active:scale-95 duration-200"
                >
                    <div className="h-32 w-full bg-bg-secondary relative">
                        <img 
                            src={recipe.image} 
                            alt={recipe.title}
                            className="w-full h-full object-cover"
                            loading="lazy"
                        />
                        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-0.5 rounded-lg shadow-sm">
                            <p className="text-primary text-[10px] font-bold">
                                {recipe.calories} kcal
                            </p>
                        </div>
                    </div>
                    <div className="p-3">
                        <h4 className="font-bold text-gray-800 text-sm mb-1 line-clamp-2 leading-snug">
                            {recipe.title}
                        </h4>
                        
                        <div className="flex items-center justify-between text-xs text-gray-400 mt-2">
                            <span className="flex items-center gap-1">
                                🕒 {recipe.time > 0 ? `${recipe.time}m` : '-'}
                            </span>
                            <span className="truncate max-w-[50%] opacity-75">{recipe.author}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}