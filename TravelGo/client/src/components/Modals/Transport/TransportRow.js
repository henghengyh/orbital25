export default function TransportRow({
    label,
    searchQuery,
    setSearchQuery,
    searchResults,
    showDropdown,
    setShowDropdown,
    onLocationSelect,
    searchLocations,
}) {
    return (
        <div className={`flex ${label === "Start Location" ? "gap-3" : "gap-5"} items-center`}>
            <h6 className="text-label">{label}:</h6>
            <div className="flex-1 relative">
                <input
                    type="text"
                    name={label}
                    value={searchQuery}
                    autoComplete="off"
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        searchLocations(e.target.value, "location");
                    }}
                    onFocus={() => {
                        if (searchResults.length > 0) {
                            setShowDropdown(true);
                        }
                    }}
                    className="text-input w-full"
                    placeholder={label.toLowerCase()}
                    required
                />

                {showDropdown && searchResults.length > 0 && (
                    <div className="absolute z-10 max-h-48 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg overflow-y-auto scrollbar">
                        {searchResults.map((location) => (
                            <div
                                key={location.placeId}
                                onClick={() => onLocationSelect(location)}
                                className="px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                            >
                                <div className="font-medium text-gray-900">
                                    {location.mainText}
                                </div>
                                {location.secondaryText && (
                                    <div className="text-sm text-gray-500">
                                        {location.secondaryText}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}