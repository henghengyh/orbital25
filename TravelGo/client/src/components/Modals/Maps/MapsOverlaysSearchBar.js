export default function MapsOverlaysSearchBar({
    handleSearch,
    searchQuery,
    setSearchQuery,
    markers,
    setMarkers
}) {
    return (
        <form onSubmit={handleSearch} className="mb-4 flex gap-2">
            <input
                type="text"
                placeholder="Search for places..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
                type="submit"
                className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={!searchQuery.trim()}
            >
                Search
            </button>
            <button
                type="button"
                onClick={() => {
                    const filteredMarkers = markers.filter(marker =>
                        marker.getTitle() === "Your Location" || marker.getLabel()
                    );
                    markers.forEach(marker => {
                        if (!marker.getLabel() && marker.getTitle() !== "Your Location") {
                            marker.setMap(null);
                        }
                    });
                    setMarkers(filteredMarkers);
                }}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
                Clear Search
            </button>
        </form>
    )
}