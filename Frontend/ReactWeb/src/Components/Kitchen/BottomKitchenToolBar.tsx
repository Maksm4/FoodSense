export default function BottomKitchenToolBox({mode, onCancel, onCook}: BottomKitchenToolBoxProps) {
  if (mode === "cooking") {
    return (
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
        <div className="flex gap-2 justify-center max-w-md mx-auto">
          <button 
            onClick={onCancel}
            className="py-3 px-6 bg-[#E8E8E8] text-gray-700 rounded-lg font-semibold hover:bg-[#D8D8D8]"
          >
            Cancel
          </button>
          <button 
            onClick={onCook}
            className="py-3 px-6 bg-[#6A994E] text-white rounded-lg font-semibold hover:bg-[#5A8A3E]"
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
        <button className="py-3 px-8 bg-[#81B29A] text-white rounded-lg font-semibold hover:bg-[#71A28A]">
          + Add Item
        </button>
      </div>
    </div>
  );
}