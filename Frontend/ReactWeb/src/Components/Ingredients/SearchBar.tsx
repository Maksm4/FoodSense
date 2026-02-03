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
        className={`border border-gray-300 rounded-lg px-8 py-2 font-semibold whitespace-nowrap ${
          mode === "cooking" 
            ? "bg-cancel-danger text-white hover:bg-cancel-danger-hover" 
            : "bg-primary text-white hover:bg-primary-hover"
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
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:bg-gray-200 bg-gray-100 text-gray-700 placeholder-gray-400"
      />
    </div>
  );
}