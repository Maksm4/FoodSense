interface IngredientsToolBoxProps {
  mode: string;
  onCook: () => void;
  onCancel: () => void;
  onAdd: () => void;
}

export default function IngredientsToolBox({ mode, onCancel, onCook, onAdd }: IngredientsToolBoxProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 z-50">
      <div className="flex justify-center items-center gap-3 max-w-lg mx-auto md:max-w-none">

        {mode === "cooking" ? (
          <>
            {/* Cancel Button - Mobile Only */}
            <button 
              className="md:hidden flex-1 py-3 px-6 bg-white border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
              onClick={onCancel}
            >
              Cancel
            </button>

            <button 
              className="flex-1 md:flex-none md:w-48 py-3 px-8 bg-primary text-white rounded-xl font-semibold hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all" 
              onClick={onCook}
            >
              Cook
            </button>
          </>
        ) : (
          <button 
            className="w-full md:w-48 py-3 px-8 bg-primary text-white rounded-xl font-semibold hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all" 
            onClick={onAdd}
          >
            + Add Item
          </button>
        )}
        
      </div>
    </div>
  );
}