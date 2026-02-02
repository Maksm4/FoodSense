interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onClickCookMode: () => void;
  onClickCancelCookMode: () => void;
  mode: string;
}

export default function SearchBar({mode, searchQuery, onSearchChange, onClickCookMode, onClickCancelCookMode}: SearchBarProps) {
  return (
    <div className="flex pt-4 pb-4 space-x-2 bg-white border-b border-gray-200 sticky top-0 z-10">
      <button 
        className={`border border-gray-300 rounded-lg px-4 py-2 font-semibold whitespace-nowrap ${
          mode === "cooking" 
            ? "bg-[#E07A5F] text-white hover:bg-[#D06A4F]" 
            : "bg-[#6A994E] text-white hover:bg-[#5A8A3E]"
        }`} 
        onClick={mode === "cooking" ? onClickCancelCookMode : onClickCookMode}
      >
        {mode === "cooking" ? "Cancel" : "Select"}
      </button>
      <input
        type="text"
        placeholder="Search ingredients..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#81B29A] bg-[#F8F9FA] text-gray-700 placeholder-gray-400"
      />
    </div>
  );
}