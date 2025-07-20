export default function LocationRow({
    label,
    searchQuery,
    setSearchQuery,
    searchResults,
    showDropdown,
    setShowDropdown,
    onLocationSelect,
    searchLocations,
    placeholder,
}) {
    return (
        <div className="flex space-y-4 gap-5 items-center">
            <div className="w-36">
                <h6 className="text-label">{label}:</h6>
            </div>
            <div className="flex-1 relative">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        searchLocations(e.target.value, "location");
                    }}
                    onFocus={() => {
                        if (searchResults.length > 0) {
                            setShowDropdown(true);
                        }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={placeholder}
                    required
                />
                
                {showDropdown && searchResults.length > 0 && (
                    <div className="absolute z-10 max-h-48 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg overflow-y-auto">
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