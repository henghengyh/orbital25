export default function SearchBar({ value, onChange, handleSearch, onClearSearch }) {
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="w-96 flex items-center px-4 rounded-md bg-blue-100">
            <input
                type="text"
                placeholder="Search Itinerary"
                className="w-full text-xs bg-transparent py-[11px] outline-none"
                value={value}
                onChange={onChange}
                onKeyDown={handleKeyDown}
            />
            {
                value &&
                <p onClick={onClearSearch} className="text-lg place-items-center grid text-slate-400 cursor-pointer hover:text-black mr-2">
                    <ion-icon name="close"></ion-icon>
                </p>
            }
            <button aria-label="search" onClick={handleSearch} className="place-items-center grid text-slate-400 cursor-pointer hover:text-black">
                <ion-icon name="search"></ion-icon>
            </button>
        </div>
    );
}
