interface BottomKitchenToolBoxProps {
  mode: string;
  onCook: () => void;
  onCancel: () => void;
}

export default function BottomKitchenToolBox({mode, onCancel, onCook}: BottomKitchenToolBoxProps) {
  if (mode === "cooking") {
    return (
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
        <div className="flex gap-2 justify-center max-w-md mx-auto">
          <button 
            onClick={onCancel}
            className="py-3 px-6 bg-cancel text-gray-700 rounded-lg font-semibold hover:bg-cancel-hover"
          >
            Cancel
          </button>
          <button 
            onClick={onCook}
            className="py-3 px-6 bg-primary text-white rounded-lg font-semibold hover:bg-primary-hover"
          >
            Cook
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
      <div className="flex justify-center">
        <button className="py-3 px-8 bg-primary text-white rounded-lg font-semibold hover:bg-primary-hover">
          + Add Item
        </button>
      </div>
    </div>
  );
}