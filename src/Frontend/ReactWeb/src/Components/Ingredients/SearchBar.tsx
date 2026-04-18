interface SearchBarProps {
    onSearchChange: (query: string) => void;
    searchQuery: string;
    onClickCookMode: () => void;
    onClickCancelCookMode: () => void;
    mode: string;
}

export default function SearchBar({ 
    onSearchChange, 
    searchQuery,
    mode
}: SearchBarProps) {
    return (
        <div className="relative w-full">
            <div className="relative">
                <i className="fa-solid fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input
                    type="text"
                    placeholder="Search ingredients..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 focus:outline-none transition-all ${
                        mode === "cooking"
                            ? 'border-primary bg-primary/5 focus:border-primary focus:ring-2 focus:ring-primary/20'
                            : 'border-gray-200 bg-white focus:border-primary'
                    }`}
                />
            </div>
        </div>
    );
}